var React = require("react/addons");
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ALIGN_CONTENT_SE = "";
var ALIGN_CONTENT_NE = "align-content-ne";
var ALIGN_CONTENT_SW = "align-content-sw";
var ALIGN_CONTENT_NW = "align-content-nw";

require("./react-drop-button.scss");

var DropTrigger = React.createClass({
	render: function() {
		return (
			<div className="drop-trigger">
				{this.props.children}
			</div>
		);
	}
});

var DropBoxContent = React.createClass({
	render: function() {
		return (
			<div className="drop-box-content">
				{this.props.children}
			</div>
		);
	}
});

var DropButton = React.createClass({
	statics: {
		DropTrigger: DropTrigger,
		DropBoxContent: DropBoxContent,
		ALIGN_CONTENT_SE: ALIGN_CONTENT_SE,
		ALIGN_CONTENT_NE: ALIGN_CONTENT_NE,
		ALIGN_CONTENT_SW: ALIGN_CONTENT_SW,
		ALIGN_CONTENT_NW: ALIGN_CONTENT_NW
	},
	propsTypes: {
		label: React.PropTypes.string.isRequired,
		layoutMode: React.PropTypes.string,
		transitionOn: React.PropTypes.bool
	},
	getInitialState: function() {
		return {open: false};
	},
	getDefaultProps: function() {
		return {layoutMode: ALIGN_CONTENT_SE,
				transitionOn: true};
	},
	componentWillMount: function() {
		//bubble events up to the top
		document.body.addEventListener("click", this.handleOutsideClick, false);
	},
	componentWillUnmount: function() {
		//remove the listener when the component isn't mounted to a DOM node
		document.body.removeEventListener("click", this.handleOutsideClick);
	},
	getChildElementByType: function(type) {
		var children = this.props.children;
		return children.filter(function(childElement) {return childElement.type.displayName === type;});
	},
	toggleDropBox: function() {
		this.setState({open: !this.state.open});
	},
	handleOutsideClick: function(event) {
		var dropBoxDOM = this.refs.dropBox && this.refs.dropBox.getDOMNode();
		var buttonDOM = this.refs.button.getDOMNode();
		//if the click was within the dropdown box panel dont close it
		if( (dropBoxDOM && dropBoxDOM.contains(event.target)) || (buttonDOM && buttonDOM.contains(event.target)) || !this.state.open)
			return;
		//close the box
		this.toggleDropBox();
	},
	render: function() {
		var dropBoxClassName = 'rdb-drop-box';
		var dropBox = '', buttonStatus = "closed", transitionGroup;
		var dropBoxContent = null;
		
		var dropTrigger = null;
		dropBoxContent = this.getChildElementByType("DropBoxContent");
		dropTrigger = this.getChildElementByType("DropTrigger");

		if(this.state.open) {
			dropBox = (
				<div ref={"dropBox"} className={dropBoxClassName}  key="drop-box">
					{dropBoxContent}
				</div>
			);
			buttonStatus = "open";
		}
		if(this.props.transitionOn) {
			transitionGroup = (
				<ReactCSSTransitionGroup transitionName="drop-box-transition">
				{dropBox}
				</ReactCSSTransitionGroup>
			);
		}
		else
			transitionGroup = dropBox;
		return (
			<div className={"react-drop-button" + " " + this.props.layoutMode}>
				<button ref={"button"} className={buttonStatus + " rdb-button"} onClick={this.toggleDropBox}>
					{dropTrigger}
				</button>
				
				{transitionGroup}
				
			</div>
		);
	}
});

module.exports = DropButton;
