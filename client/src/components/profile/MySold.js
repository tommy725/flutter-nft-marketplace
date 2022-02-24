import React from 'react'
import OrderRow from './OrderRow'


class MySold extends React.Component {

    // componentDidMount() {
    //     axios
    //         .get(`${HOST}:50667/order/sold`, { params: { _id: this.props.accountId } })
    //         .then(res => this.setState({
    //             myOrderList: res.data,
    //             loaded: true
    //         }))
    //         .catch(_ => window.location = `${HOST}:50666/error`)
    // }

    render() {
        return (
            <>
                <h4>{this.props.title}</h4>
                <div className='py-3 '>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Item</th>
                                    <th>Order</th>
                                    <th>Seller</th>
                                    <th>Purchaser</th>
                                    <th>State</th>
                                    <th>Deadline</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.loaded
                                    ? this.props.mySoldList.map(order => <OrderRow order={order} web3={this.props.web3} accountId={this.props.accountId} key={order._id} />)
                                    : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export default MySold