import React, { Component } from 'react'
import api from '../api'

class ModelsUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            entity: 'a-entity',
            fname: '',
            positionX: '',
            positionY: '',
            positionZ: '',
            rotationX: '',
            rotationY: '',
            rotationZ: '',
            scale: '',
        }
    }

    handleChangeInputPositionX = async event => {
        const positionX = event.target.value
        this.setState({ positionX })
    }
    handleChangeInputPositionY = async event => {
        const positionY = event.target.value
        this.setState({ positionY })
    }
    handleChangeInputPositionZ = async event => {
        const positionZ = event.target.value
        this.setState({ positionZ })
    }
    handleChangeInputRotationX = async event => {
        const rotationX = event.target.value
        this.setState({ rotationX })
    }
    handleChangeInputRotationY = async event => {
        const rotationY = event.target.value
        this.setState({ rotationY })
    }
    handleChangeInputRotationZ = async event => {
        const rotationZ = event.target.value
        this.setState({ rotationZ })
    }
    handleChangeInputScale = async event => {
        const scale = event.target.value
        this.setState({ scale })
    }

    handleUpdateModel = async () => {
        const { id, entity, fname, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, scale } = this.state

        const payload = this.state

        await api.updateModelById(id, payload).then(res => {
            window.alert(`Model updated successfully`)
            this.setState({
                entity: 'a-entity',
                fname: '',
                positionX: '',
                positionY: '',
                positionZ: '',
                rotationX: '',
                rotationY: '',
                rotationZ: '',
                scale: '',
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const movie = await api.getModelById(id)

        this.setState({
            fname: movie.data.data.fname,
            positionX: movie.data.data.positionX,
            positionY: movie.data.data.positionY,
            positionZ: movie.data.data.positionZ,
            rotationX: movie.data.data.rotationX,
            rotationY: movie.data.data.rotationY,
            rotationZ: movie.data.data.rotationZ,
            scale: movie.data.data.scale,
        })
    }

    render() {
        const { entity, fname, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, scale } = this.state

        return (
            <Wrapper>
                <Title>Update Model</Title>

                <Label>Position X: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={positionX}
                    onChange={this.handleChangeInputPositionX()}
                />

                <Label>Position Y: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={positionY}
                    onChange={this.handleChangeInputPositionY()}
                />

                <Label>Position Z: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={positionZ}
                    onChange={this.handleChangeInputPositionZ()}
                />

                <Label>Rotation X: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={rotationX}
                    onChange={this.handleChangeInputRotationX()}
                />

                <Label>Rotation Y: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={rotationY}
                    onChange={this.handleChangeInputRotationY()}
                />

                <Label>Rotation Z: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={rotationZ}
                    onChange={this.handleChangeInputRotationZ()}
                />

                <Label>Scale: </Label>
                <InputText
                    type="number"
                    step="any"
                    lang="en-US"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={scale}
                    onChange={this.handleChangeInputScale()}
                />

                <Button onClick={this.handleUpdateModel()}>Update Model</Button>
                <CancelButton href={'/models/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default ModelsUpdate