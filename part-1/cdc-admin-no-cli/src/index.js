import React from './lib/react';
import ReactDOM from './lib/react-dom';
import App from './App';
import AuthorBox from './Author';
import BookBox from './Book';
import Home from './Home';
import {Router, browserHistory, Route, IndexRoute} from './lib/react-router';

ReactDOM.render(
    // <App />,
    // React Router V3
    (<Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="/author" component={AuthorBox} />
            <Route path="/book" component={BookBox} />
        </Route>
    </Router>),
    // React Router V4
    // (<Router>
    //     <App>
    //         <Switch>
    //             <Route exact path="/" component={Home} />
    //             <Route path="/author" component={AuthorBox} />
    //             <Route path="/book" component={BookBox} />
    //         </Switch>
    //     </App>
    // </Router>),
    document.getElementById('root')
);
