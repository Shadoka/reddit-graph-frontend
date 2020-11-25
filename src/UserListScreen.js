import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const REDDIT_USER_PREFIX = "https://www.reddit.com/u/";

function ListItemLink(props) {
    return <ListItem button component="a" {...props}/>
}

/**
 * Represents a list of users.
 * Properties:
 * data         => string array of users
 * list_title   => how the list should be titled
 */
class UserListScreen extends React.Component {

    render() {
        const list_items = this.props.data.map(user => {
            const user_link = REDDIT_USER_PREFIX.concat(user);

            return (
                <ListItemLink className='list-item' href={user_link} variant='outlined' target='_blank' key={user}>
                    <ListItemText primary={user}/>
                </ListItemLink>
            );
        });

        var lists = [];
        if (list_items.length <= 10) {
            lists.push(<List component='nav'>{list_items}</List>);
        } else {
            const half_index = Math.ceil(list_items.length / 2);
            const first_half = list_items.slice(0, half_index);
            const second_half = list_items.slice(half_index);
            lists.push(<List className='user-list' component='nav'>{first_half}</List>);
            lists.push(<List className='user-list' component='nav'>{second_half}</List>);
        }

        return (
            <div className='list-container'>
                <Typography className='list-title' variant='h2' guttterbottom>
                    {this.props.list_title}
                </Typography>
                {lists}
            </div>
        );
    }
}

export default UserListScreen;