import PubSub from 'pubsub-js';

// Flux pattern
// @see: https://facebook.github.io/flux/docs/overview.html#content
export default class TimelineStore {
    
    constructor(photos) {
        this.photos = photos;
    }

    list(profileUrl) {
        fetch(profileUrl)
       .then(response => response.json())
       .then(photos => {         
            this.photos = photos;
            PubSub.publish('timeline', this.photos);
            this.loadQuantityLabel();
       });     
    }

    loadQuantityLabel() {
        this.photos.forEach(photo => this.changeQuantityLabel(photo));
        PubSub.publish('timeline', this.photos);
    }

    changeQuantityLabel(photo) {
        if(photo.likers.length === 1) photo.likeadaLabel = ' curtiu';
        else if(photo.likers.length > 1) photo.likeadaLabel = ' curtiram';
        else photo.likeadaLabel = '';
    }

    comment(photoId, commentText) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({texto: commentText}),
            headers: new Headers({
                'Content-type':'application/json'
            })
        };
  
        fetch(`http://localhost:8080/api/fotos/${photoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if(response.ok) return response.json();
                else throw new Error("Não foi possível comentar nessa foto!");
            })
            .then(newComment => {
                const findedPhoto = this.photos.find(photo => photo.id === photoId);
                findedPhoto.comentarios.push(newComment);
                PubSub.publish('timeline', this.photos);
            });      
    }
  
    like(photoId) {
        fetch(`http://localhost:8080/api/fotos/${photoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, {method:'POST'})
            .then(response => {
                if(response.ok) return response.json();
                else throw new Error("não foi possível realizar o like da foto");
            })
            .then(liker => {
                const findedPhoto = this.photos.find(photo => photo.id === photoId);
                
                findedPhoto.likeada = !findedPhoto.likeada;
                const possibleLiker = findedPhoto.likers.find(actualLiker => actualLiker.login === liker.login);
                
                if(possibleLiker === undefined) findedPhoto.likers.push(liker);
                else {
                    const newLikers = findedPhoto.likers.filter(actualLiker => actualLiker.login !== liker.login);
                    findedPhoto.likers = newLikers;
                }

                this.changeQuantityLabel(findedPhoto);
                PubSub.publish('timeline', this.photos);
            });
    }
  
    subscribe(callback) {
        PubSub.subscribe('timeline', (topic, photos) => {
            callback(photos);
        });        
    }
}

