import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

class ToastAutoHide extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            message: props.message
        }
    }

    copyToClipboard = event => {
        event.stopPropagation()
        navigator.clipboard.writeText(this.props.content)
        this.setState({ message: this.props.feedback })
    }

    showTooltip = () => {
        this.setState({ show: true })
    }

    hideTooltip = () => {
        this.setState({ show: false })
        setTimeout(() => this.setState({ message: this.props.message }), 3000)
    }

    render() {
        return (
            <OverlayTrigger
                trigger={["hover", "focus"]}
                delay={{ hide: 250, show: 0 }}
                show={this.state.show}
                overlay={(props) => (
                    <Tooltip {...props}>
                        {this.state.message}
                    </Tooltip>
                )}
                placement="bottom"
            >
                <span
                    onClick={this.copyToClipboard}
                    onMouseEnter={this.showTooltip}
                    onMouseLeave={this.hideTooltip}
                    className='overflow-hidden text-nowrap'
                    style={{ zIndex: 999 }}
                >
                    <FontAwesomeIcon icon={faCopy} /> { }
                    <span className='overflow-hidden text-wrap text-break'>{this.props.title}</span>
                </span>
            </OverlayTrigger>
        )
    }
}

export default ToastAutoHide
