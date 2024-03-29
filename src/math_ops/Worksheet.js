import React, { Component } from 'react';

import Add  from './Add'
import Sub  from './Sub'
import Mult from './Mult'

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

class Worksheet extends Component {

    constructor(props) {
        super(props);
        this.newOperation = this.selectedOperation = 'Addition';
        this.state = {}
        this.showStepsCallback = this.showStepsCallback.bind(this);
        this.newProblemsCallback = this.newProblemsCallback.bind(this);
        this.showAnswerCallback = this.showAnswerCallback.bind(this);
        this.change = this.change.bind(this);
        this.new = true;
        this.stepFlag = false;
        this.answerFlag = false;
    }

    showStepsCallback() {
        if (!this.stepFlag) {
            this.stepFlag = true;
            this.answerFlag = false;
            this.setState({})
        }
    }

    showAnswerCallback() {
        if (!this.answerFlag) {
            this.answerFlag = true;
            this.stepFlag = false;
            this.setState({})
        }
    }

    newProblemsCallback() {
        this.new = true;
        this.stepFlag = false;
        this.answerFlag = false;
        this.setState({})
    }

    componentDidUpdate(prevProps, prevState) {
        this.resetState();
    }

    resetState() {
        this.stepFlag = false;
        this.new = false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidMount() {
        this.resetState();
    }

    showProblems() {
        let result = [];
        const operation = this.selectedOperation;
        let count = this.refs.count ? parseInt(this.refs.count.value) : 10;

        if (operation === 'Addition') {
            for (let i = 0; i < count; i++) {
                result.push(
                    <div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }}>
                        { <Index index={i + 1} /> }
                        <Add key={i} check={this.stepFlag} new={this.new} />
                    </div>
                );
            }
        } else if (operation === 'Subtraction') {
            for (let i = 0; i < count; i++) {
                result.push(
                    <div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }}>
                        { <Index index={i + 1} /> }
                        <Sub key={i} check={this.stepFlag} new={this.new} />
                    </div>
                );
            }
        } else if (operation === 'Multiplication') {
            for (let i = 0; i < 10; i++) {
                result.push(<div key={i} style={{ borderStyle: 'solid', borderColor: 'gray', margin: '10px 40px 10px 10px', position: 'relative' }} >
                    {<Index index={i + 1} />}
                    <Mult key={i} check={this.stepFlag} new={this.new} /> </div>);
            }
        }

        return result;
    }

    change(event) {
        this.newOperation = event.target.value;
        if (this.selectedOperation !== this.newOperation) {
            this.selectedOperation = this.newOperation;
            this.new = true;
            this.stepFlag = false;
            this.setState({});
        }
    }

    render() {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <select onChange={this.change} defaultValue={this.selectedOperation}>
                        <option value="Addition">Addition</option>
                        <option value="Subtraction">Subtraction</option>
                        <option value="Multiplication">Multiplication</option>
                    </select>
                    <button onClick={this.showStepsCallback}> Steps </button>
            { /* <button onClick={this.showAnswerCallback}> Answers </button> */ }
                    <button onClick={this.newProblemsCallback}> New </button>
                </div>
                <div className="container" style={{ margin: '10px' }}>
                    <div>
                        {this.showProblems()}
                    </div>
                </div>
            </div >)
    }
}

export default Worksheet;
