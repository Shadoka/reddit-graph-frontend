import React from 'react';
import SubredditButton from './SubredditButton';

/*
* Row of subreddit buttons.
* Properties:
* buttonData      => string array of all the subreddits in this show 
* selected_subs   => string array of all currently selected subreddits
* onSubSelection  => function to execute when a subreddit is selected
*/
class ButtonRow extends React.Component {

    render() {
        const buttons = this.props.buttonData.map(data => {
            const is_selected = this.props.selected_subs.includes(data);

            return <SubredditButton name={data} clickMethod={this.props.onSubSelection} selected={is_selected} key={data}/>
        });

        return (
            <div className='button-row'>
                {buttons}
            </div>
        );
    }
}

export default ButtonRow;