var Dashboard = React.createClass({
  render: function(){
    return (
      <div>
        <Users interval={this.props.interval} />
        <Chat interval={this.props.interval} />
      </div>
    )
  }

});

var Chat = React.createClass({
  loadMessagesFromServer: function(){
    $.ajax({
      url: '/messages',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({messages: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return { messages: [] }
  },
  componentDidMount: function() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.interval );
  },
  addMessage: function(newMessage){
       $.ajax({
      url: '/messages',
      dataType: 'json',
      type: 'POST',
      data: { message: newMessage },
      success: function(data) {
        this.setState({messages: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error( status, err.toString());
      }.bind(this)
    });
 
  },
  render: function(){
    var messages = this.state.messages.map(function(message){
      return <tr><td>{message.nickname}</td><td>{message.message}</td></tr>
    })
    return (
      <div>
        <h1>Messages</h1> 
        <p>Last 15 messages</p>
        <table>
        <tbody>
        {messages}
        </tbody>
        </table>
        <SendMessage newMessage={this.addMessage} />
      </div>
    )
  }
});

var SendMessage = React.createClass({
  getInitialState: function(){
    return { message: '' }  
  },
  updateMessage: function(e){
    this.setState({ message: e.target.value });
  },
  handleNewMessage: function(e){
    e.preventDefault();
    this.props.newMessage(this.state.message);
    this.setState({ message: '' });
  },
  render: function(){
    return (
      <div>
        <form onSubmit={this.handleNewMessage}>
        <input type="text" value={this.state.message} onChange={this.updateMessage} />
        <button type="submit">Send</button>
        </form>
      </div>
    );
  } 
});


var Users = React.createClass({
  loadUsersFromServer: function(){
    $.ajax({
      url: '/users',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({users: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error( status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function(){
    return { users: [] }
  },
  componentDidMount: function() {
    this.loadUsersFromServer();
    setInterval(this.loadUsersFromServer, this.props.interval );
  },
  render: function(){
    var users = this.state.users.map(function(user){
      return <li>{user}</li>;
    });
    return (
      <div>
      <h1> Users </h1>  
      <ul>
        {users}
      </ul>
      </div>
    )
  }
});


ReactDOM.render(<Dashboard interval={2000}/>, document.getElementById('dashboard'));
