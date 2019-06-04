import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import * as keys from '../keys.json';
import queryString from 'query-string';
import {getAuthKey} from '../actions/githubActions';
import {selectAuthKey} from '../reducers/githubReducer';

class Callback extends Component {
    componentWillMount() {
        const values = queryString.parse(this.props.location.search);
        this.props.getAuthKey(keys.GH_AUTH_SERVER, values.code);
    }

    render() {
        console.log(this.props.location.search);
        return (
            <div style={{position: 'relative', left: '40%'}}>
                <p>Authentication success!</p>
                <Link to="/">Go back to Projects page</Link>
            </div>
        );
    }
}

/**
 * mapStateToProps
 * maps state in redux store (right)
 * to component props property (left)
 */
const mapStateToProps = state => ({
    authKey: selectAuthKey(state)
});

/**
 * connect(mapStateToProps, actions)(componentName)
 * connects the component to the redux store
 */
export default connect(mapStateToProps, { getAuthKey })(Callback)
