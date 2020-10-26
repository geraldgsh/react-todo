import React, { Component } from 'react';
import axios from 'axios';
import Modal from './components/Modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      activeItem: {
        title: '',
        description: '',
        completed: false,
      },
      todoList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("https://djangotodo-app.herokuapp.com/api/todos/")
      .then(res => this.setState({ todoList: res.data }))
      .catch(err => console.log(err));
  }

  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  }

  handleSubmit = item => {
    this.toggle();
    if (item.id) {
      axios
        .put(`https://djangotodo-app.herokuapp.com/api/todos/${item.id}/`, item)
        .then(res => this.refreshList());
      return;
    }
    axios
      .post("https://djangotodo-app.herokuapp.com/api/todos/", item)
      .then(res => this.refreshList());
  }

  handleDelete = item => {
    axios
      .delete(`https://djangotodo-app.herokuapp.com/api/todos/${item.id}`)
      .then(res => this.refreshList());
  }

  createItem = () => {
    const item = { title: '', description: '', completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  }

  editItem = item => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  }

  renderItems = () => {
    const { viewCompleted } = this.state;
    const { todoList } = this.state;
    const newItems = todoList.filter(
      item => item.completed === viewCompleted,
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            viewCompleted ? 'completed-todo' : ''
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            type="button"
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {' '}
            Edit
            {' '}
          </button>
          <button
            type="button"
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
            {' '}
          </button>
        </span>
      </li>
    ));
  }

  renderTabList() {
    const { viewCompleted } = this.state;
    return (
      <div className="my-5 tab-list">
        <span
          role="button"
          tabIndex="0"
          onKeyUp={this.handleKeyUp}
          onClick={() => this.displayCompleted(true)}
          className={viewCompleted ? 'active' : ''}
        >
          complete
        </span>
        <span
          role="button"
          tabIndex="0"
          onKeyDown={this.handleKeyDown}
          onClick={() => this.displayCompleted(false)}
          className={viewCompleted ? '' : 'active'}
        >
          Incomplete
        </span>
      </div>
    );
  }

  render() {
    const { modal } = this.state;
    const { activeItem } = this.state;
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} type="button" className="btn btn-primary">
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {modal ? (
          <Modal
            activeItem={activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;
