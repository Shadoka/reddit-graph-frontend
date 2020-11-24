import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const REDDIT_USER_PREFIX = "https://www.reddit.com/u/";

function ListItemLink(props) {
    return <ListItem button component="a" {...props}/>
}

class UserListScreen extends React.Component {

    render() {
        const list_items = this.props.data.map(user => {
            const user_link = REDDIT_USER_PREFIX.concat(user);

            return (
                <ListItemLink href={user_link} target='_blank' key={user}>
                    <ListItemText primary={user}/>
                </ListItemLink>
            );
        });

        return (
            <div className='list-container'>
                <List component='nav'>
                    {list_items}
                </List>
            </div>
        );
    }
}

export default UserListScreen;