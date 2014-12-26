'use strict';

/* global React, textstatistics, _ */

var R = React.DOM;

var Stats = React.createClass({
	getInitialState: function() {
		return {
			text: 'Hello'
		};
	},
	handleTextChange: function(e) {
		this.setState({
			text: e.detail.text
		});
	},
	componentWillMount: function() {
		window.addEventListener('text-change-event', this.handleTextChange, false);
	},
	componentWillUnmount: function() {
		window.removeEventListener('text-change-event', this.handleTextChange, false);
	},
	render: function() {
		var header = R.h3({}, 'Stats');
		var stats = textstatistics(this.state.text);
		var wordCount = [
			R.dt({}, 'Number of words'),
			R.dd({}, stats.wordCount())
		];
		var gunningFogScore = [
			R.dt({}, 'Readability (Gunning-Fog Index) : (6-easy 20-hard)'),
			R.dd({}, stats.gunningFogScore())
		];
		var letterCount = [
			R.dt({}, 'Letter Count'),
			R.dd({}, stats.letterCount())
		];
		var sentenceCount = [
			R.dt({}, 'Sentence Count'),
			R.dd({}, stats.sentenceCount())
		];
		var averageWordsPerSentence = [
			R.dt({}, 'Average Words Per Sentence'),
			R.dd({}, stats.averageWordsPerSentence().toFixed(2))
		];
		var averageSyllablesPerWord = [
			R.dt({}, 'Average Syllables Per Word'),
			R.dd({}, stats.averageSyllablesPerWord().toFixed(2))
		];
		var topWords = _.chain(stats.getWords()).map(function(word) {
			return word.toLowerCase();
		}).filter(function(word) {
			return isNaN(word);
		}).countBy().pairs().sortBy(function(pair) {
			return -pair[1];
		}).first(20).map(function(pair) {
			return pair[0];
		}).value();
		topWords.reverse();
		var topWordsElement = [
			R.dt({}, 'Top Words'),
			R.dd({}, topWords.join(', '))
		];
		var properties = R.dl({}, wordCount, gunningFogScore, letterCount, sentenceCount,
			averageWordsPerSentence, averageSyllablesPerWord, topWordsElement);
		return R.div({
			className: 'stats'
		}, header, properties);
	}
});

var TextEditor = React.createClass({
	getInitialState: function() {
		return {
			text: 'hello'
		};
	},
	handleTextUpdate: function(e) {
		this.setState({
			text: e.target.value
		});
		window.dispatchEvent(new CustomEvent('text-change-event', {
			detail: {
				text: e.target.value
			},
			bubbles: true
		}));
	},
	render: function() {
		return R.textarea({
			className: 'text-editor',
			onChange: this.handleTextUpdate,
			value: this.state.text
		});
	}
});

var App = React.createClass({
	render: function() {
		var sidebar = R.div({
			className: 'sidebar'
		}, stats);
		return R.div(null, textEditor, sidebar);
	}
});

var StatsFactory = React.createFactory(Stats);
var TextEditorFactory = React.createFactory(TextEditor);
var AppFactory = React.createFactory(App);

var stats = new StatsFactory();
var textEditor = new TextEditorFactory({
	stats: stats
});

React.render(new AppFactory(), document.body);