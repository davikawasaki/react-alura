import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthorBox from './Author';
import BookBox from './Book';
import Home from './Home';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    // <App />,
    // React Router V3
    // (<Router history={browserHistory}>
    //     <Route path="/" component={App}>
    //         <IndexRoute component={Home} />
    //         <Route path="/author" component={AuthorBox} />
    //         <Route path="/book" />
    //     </Route>
    // </Router>),
    (<Router>
        <App>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/author" component={AuthorBox} />
                <Route path="/book" component={BookBox} />
            </Switch>
        </App>
    </Router>),
    document.getElementById('root')
);
registerServiceWorker();
