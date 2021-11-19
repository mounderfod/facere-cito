import React from 'react';
import ReactDOM from 'react-dom';
import '../src/index.css';
import EditableLabel from 'react-inline-editing';
import { v4 as uuidv4 } from 'uuid';

function TodoItem(props) {
    let checkbox = props.enabled ? <input type="checkbox" className="box" onClick={(event) => props.updateBox(event)} checked /> : <input type="checkbox" className="box" onClick={(event) => props.updateBox(event)} />;
    return (
        <div>
            {checkbox}
            <div class="contents">
                <EditableLabel text={props.contents}
                    labelClassName={props.className}
                    inputClassName='todoInput'
                    inputWidth='1000px'
                    inputHeight='25px'
                    inputMaxLength='100'
                    onFocusOut={props._handleFocusOut}
                />
            </div>
        </div>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: JSON.parse(localStorage.getItem('todos')),
        };

    }

    render() {
        return (
            <div>
                <h1>facere cito</h1>
                <ul>{this.state.todos.sort((t1, t2) => {
                    if (t1.enabled && !t2.enabled) { return 1; } else if (!t1.enabled && t2.enabled) { return -1; } else { return 0; }
                }).map((todo) =>
                    <TodoItem key={todo.id}
                        enabled={todo.enabled}
                        contents={todo.contents}
                        className={todo.enabled ? "todoLabelDone" : "todoLabel"}
                        updateBox={(event) => this.updateBox(event, todo.id)}
                        _handleFocusOut={(text) => this._handleFocusOut(text, todo.id)}
                    />
                )}
                </ul>
                <button className="add" onClick={() => this.handleAddClick()}>Add item</button>
                <button className="clear" onClick={() => this.handleClearClick()}>Clear all tasks</button>
                <button className="reset" onClick={() => this.handleResetClick()}>Reset to default</button>
            </div>

        );
    }

    componentDidMount() {
        document.title = "facere cito";
    }

    handleClearClick() {
        window.localStorage.setItem('todos', JSON.stringify([]));
        window.location.reload();
        this.forceUpdate();
    }

    handleResetClick() {
        window.localStorage.setItem('todos', JSON.stringify([
            { id: uuidv4(), enabled: false, contents: "👋 Hello! Welcome to facere cito." },
            { id: uuidv4(), enabled: false, contents: "📝 A sleek, minimal, and easy way to keep track of your tasks." },
            { id: uuidv4(), enabled: false, contents: "✍ Click any of these tasks to edit their text. Click outside of the text box to save." },
            { id: uuidv4(), enabled: false, contents: "🙂 Task text can include any Unicode, including emojis." },
            { id: uuidv4(), enabled: false, contents: "❌ Delete tasks by shift-clicking the tick button, or by clearing the text." },
            { id: uuidv4(), enabled: true, contents: "✅ Completed tasks go to the bottom." },
        ]));
        window.location.reload();
        this.forceUpdate();
    }

    handleAddClick() {
        window.localStorage.setItem('todos', JSON.stringify(this.state.todos.concat([{ id: uuidv4(), enabled: false, contents: "Hello! Click me to edit!" }])));
        window.location.reload();
        this.forceUpdate();
    }

    _handleFocusOut(text, id) {
        let newTodos = this.state.todos;
        let todoIndex = newTodos.findIndex(function (t) { return t.id === id; });
        if (text === "") {
            newTodos.splice(todoIndex, 1);
        } else {
            newTodos[todoIndex].contents = text;
        }
        window.localStorage.setItem('todos', JSON.stringify(newTodos));
        this.forceUpdate();
    }

    updateBox(event, id) {
        let newTodos = this.state.todos;
        let todoIndex = newTodos.findIndex(function (t) { return t.id === id; });
        if (event.shiftKey) {
            newTodos.splice(todoIndex, 1);
        } else {
            newTodos[todoIndex].enabled = !newTodos[todoIndex].enabled;
        }
        window.localStorage.setItem('todos', JSON.stringify(newTodos));
        this.forceUpdate();
    }
}

if (!window.localStorage.getItem('todos')) {
    window.localStorage.setItem('todos', JSON.stringify([
        { id: uuidv4(), enabled: false, contents: "👋 Hello! Welcome to facere cito." },
        { id: uuidv4(), enabled: false, contents: "📝 A sleek, minimal, and easy way to keep track of your tasks." },
        { id: uuidv4(), enabled: false, contents: "✍ Click any of these tasks to edit their text. Click outside of the text box to save." },
        { id: uuidv4(), enabled: false, contents: "🙂 Task text can include any Unicode, including emojis." },
        { id: uuidv4(), enabled: false, contents: "❌ Delete tasks by shift-clicking the tick button, or by clearing the text." },
        { id: uuidv4(), enabled: true, contents: "✅ Completed tasks go to the bottom." },
    ]));
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);