import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

class UpdateModel extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/movies/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class DeleteModel extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete the movie ${this.props.id} permanently?`,
            )
        ) {
            api.deleteModelById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class ModelsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            models: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllModels().then(models => {
            this.setState({
                models: models.data.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { models, isLoading } = this.state

        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Filename',
                accessor: 'fname',
                filterable: true,
            },
            {
                Header: 'PositionX',
                accessor: 'positionX',
                filterable: true,
            },
            {
                Header: 'PositionY',
                accessor: 'positionY',
                filterable: true,
            },
            {
                Header: 'PositionZ',
                accessor: 'positionZ',
                filterable: true,
            },
            {
                Header: 'RotationX',
                accessor: 'rotationX',
                filterable: true,
            },
            {
                Header: 'RotationY',
                accessor: 'rotationY',
                filterable: true,
            },
            {
                Header: 'RotationZ',
                accessor: 'rotationZ',
                filterable: true,
            },
            {
                Header: 'Scale',
                accessor: 'scale',
                filterable: true,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteModel id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <UpdateModel id={props.original._id} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!models.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={models}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default ModelsList