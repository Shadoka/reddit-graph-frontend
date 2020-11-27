import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';

class ActionButtonColumn extends React.Component {

    render() {
        return (
            <div className='action-button-container'>
                <div className='center-container'>
                    <ButtonGroup orientation="vertical" color="primary" aria-label="vertical contained primary button group" variant="contained">
                        <Button startIcon={<PersonIcon />} onClick={() => this.props.userDataFetchMethod()}>
                            Friend Chart
                        </Button>
                        <Button startIcon={<PeopleIcon />}>
                            Friends of friends
                        </Button>
                        <Button startIcon={<BubbleChartIcon />}>
                            Cliques
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
}

export default ActionButtonColumn;