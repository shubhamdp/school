
import React, { Component } from 'react';
import classNames from 'classnames'
import { findDOMNode } from 'react-dom';

function Index(props) {
    return <div className="circle"> {props.index} </div>
}

class Add extends Component {
    constructor(props) {
        super(props);
        this.numbers = 3;
        this.size = 4;
        this.TEXT_HEIGHT = 40
        this.HALF_BIG_FONT_HEIGHT = 15;
        this.BIG_FONT_HEIGHT = '30px'
        this.SMALL_FONT_HEIGHT = '20px'
        this.CARRYOVER_HEIGHT = 30;
        this.LINE_HEIGHT = 0;
        this.INPUT_HEIGHT = 80;
        this.LETTER_WIDTH = 25;
        this.Y_START = 25;
        this.X_START = 0;
        this.Y = this.Y_START;
        this.X = this.X_START;
        this.showAnswer = false;
        this.lineKey = 0;
        this.sums = this.constructProblem();
    }

    setDimension() {
        for (let i = 0; i <= 1; i++) {
            const el = findDOMNode(this.refs['sum' + i]);
            if (el) {
                const bbox = el.getBBox();
                el.setAttributeNS(null, 'width', bbox.width + 20)
                el.setAttributeNS(null, 'height', bbox.height + 20)
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.setDimension();
    }

    componentDidMount() {
        this.setDimension();
    }

    constructProblem() {
        this.addends = [];
        let answer = 0;
        for (let i = 0; i < this.numbers; i++) {
            const number = Math.floor((Math.random() * 1000) + 1);
            answer += number;
            this.addends.push(number.toString().split('').map((e) => (+e)));
        }
        this.answerArray = answer.toString().split('').map((e) => (+e));
        this.length = this.answerArray.length;
        this.formatSum();
    }

    plus(x, y) {
        return (<g>
            <line x1={x} y1={y - 8} x2={x + 16} y2={y - 8} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
            <line x1={x + 8} y1={y - 16} x2={x + 8} y2={y} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />
        </g>)
    }

    textline(line) {
        const y = this.Y;
        this.Y += line.size ? 35 : this.TEXT_HEIGHT;
        const xStart = 1.25 * this.LETTER_WIDTH + (this.length - line.texts.length) * this.LETTER_WIDTH;
        let operation = null;
        if (line.hasOwnProperty('operation') && line.operation === '+') {
            operation = this.plus(0, y)
        }
        let nonZeroFound = false;
        let texts = line.texts.map((e, i) => {
            if (e.text !== '0' && !nonZeroFound) {
                nonZeroFound = true;
            }
            let visibility = nonZeroFound && e.text !== 'x' ? 'visible' : 'hidden';
            if (i === line.texts.length - 1 && !nonZeroFound && !line.hasOwnProperty('isCarryOver')) {
                visibility = 'visible';
            }
            const fill = line.hasOwnProperty('isCarryOver') ? 'orange' : 'black';
            return <text key={i} x={xStart + i * this.LETTER_WIDTH} y={y} style={{ fill: `${fill}`, fontSize: line.size, textAnchor: 'middle', visibility: `${visibility}`, fontWeight: e.weight ? e.weight : 'normal' }}>{e.text} </text>
        });
        return <g key={this.lineKey++}> {operation} {texts} </g>
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.check) {
            this.showAnswer = true;
        }
        if (nextProps.new) {
            this.constructProblem();
            this.showAnswer = false;
        }
    }

    formatSum() {
        this.displayProblem();
        this.displayAnswer();
    }

    addCarryOverLine(answer) {
        const carryText = this.carryover();
        let foundCarryDiigit = false;
        for (let i = 0; i < carryText.length; i++) {
            if (carryText[i] !== 'x') {
                foundCarryDiigit = true;
            }
        }
        if (!foundCarryDiigit) {
            return;
        }
        const carryOverLine = this.numberToTextline(carryText);
        carryOverLine.size = this.SMALL_FONT_HEIGHT;
        carryOverLine.isCarryOver = true;
        answer.textlines.push(carryOverLine);
    }

    displayAnswer() {
        this.answer = {};
        const answer = this.answer;
        answer.textlines = [];
        this.addCarryOverLine(answer);
        answer.textlines.push(...this.problem.textlines);
        answer.textlines.push(this.numberToTextline(this.answerArray));
    }

    displayProblem() {
        this.problem = {};
        this.problem.textlines = [];
        for (let i = 0; i < this.addends.length; i++) {
            const line = this.numberToTextline(this.addends[i]);
            if (i > 0) {
                line.operation = '+';
            }
            this.problem.textlines.push(line);
        }
        this.problem.textlines.push({ type: 'line' });
    }

    line() {
        let y = this.Y - this.TEXT_HEIGHT / 2;
        this.Y += this.LINE_HEIGHT + 10;

        return (<line key={this.lineKey++} x1={this.X} y1={y} x2={this.X + this.length * this.LETTER_WIDTH + this.LETTER_WIDTH / 2} y2={y} style={{ stroke: 'rgb(0,0,0)', strokeWidth: '2' }} />)
    }

    numberToTextline(number) {
        let textline = {};
        textline.type = 'textline';
        textline.size = this.BIG_FONT_HEIGHT;
        textline.texts = number.map((d) => {
            return {
                text: d.toString()
            }
        })
        return textline;
    }

    renderSum(s, i, border, anchor) {
        return <div className={classNames('sum1', border)} >
            <Index index={anchor} />
            <svg ref={'sum' + i} style={{}}>
                {this.Y = this.Y_START} {this.X = this.X_START}
                {
                    s.textlines.map((l) => {
                        switch (l.type) {
                            case 'textline':
                                return this.textline(l);
                            case 'line':
                                return this.line();
                            default:
                                return this.line();
                        }
                    })
                }
            </svg>
        </div>
    }

    carryover() {
        let sum = 0;
        let carryoverDigits = [];
        let carry = 0;
        for (let i = this.addends[0].length - 1; i >= 0; i--) {
            for (let j = 0; j < this.addends.length; j++) {
                sum += parseInt(this.addends[j][i], 10);
            }
            if (sum > 9) {
                let sumString = sum.toString();
                carry = sumString.slice(0, sumString.length - 1);
                carryoverDigits.push(carry)
                sum = parseInt(carry);
            } else {
                sum = 0;
                carryoverDigits.push('x')
            }
        }
        carryoverDigits.unshift('x');
        carryoverDigits[carryoverDigits.length - 1] = 'x';
        return carryoverDigits.reverse();
    }

    render() {
        return (
            <div className="sumContainer" style={{ display: 'flex', margin: '20px', flexWrap: 'wrap' }}>
                {this.renderSum(this.problem, 0, 'blueBorder', 'Question')}
                {this.showAnswer &&
                    this.renderSum(this.answer, 1, 'greenBorder', 'Answer')
                }
            </div>)
    }
}

export default Add;
