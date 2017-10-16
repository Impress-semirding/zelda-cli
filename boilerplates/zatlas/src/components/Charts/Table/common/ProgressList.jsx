/**
* @Author: anrui <inverse>
* @Date:   2016-12-12T17:57:09+08:00
* @Last modified by:   inverse
* @Last modified time: 2016-12-13T12:19:01+08:00
*/

import React, {PropTypes} from 'react';

import {ListHeader, ListBody, List, ListItem, ListItemColumn, ListHeaderColumn} from '../index';

const getStyles = (props, context) => {
    const {list} = context.muiTheme;
    const {
        style,
        listStyle,
        listItemStyle
    } = props;
    return {
        fontSize: 12,
        list: {
            color: '#4E4E4E',
            ...listStyle,
            item: {
                ...listItemStyle
            },
        },
        ...style,
    };
};

class SpecialListItem extends React.Component {

    render () {
        const {
            style,
            data
        } = this.props;
        const {id, ...others} = data;

        return (
            <ListItem style={style}>
                {
                    Object.values(others).map((label, k) => {
                        if (typeof label == 'object') {
                            const {value: pValue, color: pColor} = label || {
                                value: 0,
                                color: 'rgba(208, 1, 27, 0.08)'
                            };
                            return (
                                <ListItemColumn style={{flex: 1, height: '100%', display: 'flex', flexDirection: 'column', margin: '0 0.5rem'}} key={k}>
                                    <div style={{flex: 1, height: '100%', width: pValue * 100 + '%', backgroundColor: pColor}}></div>
                                </ListItemColumn>
                            )
                        } else {
                            return (
                                <ListItemColumn style={{flex: 1, margin: '0 0.5rem'}} key={k} label={label}></ListItemColumn>
                            )
                        }
                    })
                }
            </ListItem>
        );
    }
}

export default class ProgressList extends React.Component {

    static propTypes = {

        header: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.any.isRequired,
            type: PropTypes.string,
            labelName: PropTypes.string,
            labelStyle: PropTypes.object
        })),

        /**
        * [data which is all list item data]
        * @type {array}
        */
        body: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.any.isRequired
        })).isRequired,

        /**
        * list
        * @type {object}
        */
        listStyle: PropTypes.object,

        /**
        * [listItemStyle description]
        * @type {[type]}
        */
        listItemStyle: PropTypes.object,
    };

    static contextTypes = {
        muiTheme: PropTypes.object,
    };

    constructor (props) {
        super(props);
    }

    render () {
        const header = this.props.header;
        const stl = getStyles(this.props, this.context);
        const data = this.props.body;

        return (
            <div style={stl}>
                <ListHeader>
                    {
                        header.map((e, index) => (
                            <ListHeaderColumn key={index} style={{flex: 1, fontSize: stl.fontSize, margin: '0 0.5rem'}} {...e}></ListHeaderColumn>
                        ))
                    }
                </ListHeader>
                <ListBody>
                    <List style={stl.list}>
                        {
                            data.map((item, index) => {
                                return (
                                    <SpecialListItem style={stl.list.item} key={index} data={item}/>
                                )
                            })
                        }
                    </List>
                </ListBody>
            </div>
        );
    }
}
