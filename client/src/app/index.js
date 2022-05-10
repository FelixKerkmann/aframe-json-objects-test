import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ModelsList, ModelsInsert, ModelsUpdate } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/models/list" exact component={ModelsList} />
                <Route path="/models/create" exact component={ModelsInsert} />
                <Route
                    path="/models/update/:id"
                    exact
                    component={ModelsUpdate}
                />
            </Switch>
        </Router>
    )
}

export default App