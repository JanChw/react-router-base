'use strict';

import 'semantic-ui';
import React from 'react';
import LinkedStatedMixin from'react-addons-linked-state-mixin';

export default React.createClass({
    mixins: [LinkedStatedMixin],
    getInitialState: function(){
        return {
            message: 'two way binding'
        }
    },
    render: function(){
        return(
            <div>
                <p>{this.state.message}</p>
                <input type="text"  valueLink={this.linkState('message')}/>
            </div>
        );
    }
});
