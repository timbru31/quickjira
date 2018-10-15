import { Component, h, render } from 'preact';
// import MainTab from '../components/MainTab';
// import SETTINGS from '../constants';

export interface IPopupState {
	settings: object;
}

/**
 * Top-level container.
 *
 * @class Popup
 * @extends {Component<{}, PopupState>}
 */
class Popup extends Component<{}, IPopupState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			// Initialize with all settings set to null
			settings: {}
		};
	}

	public componentDidMount() {
		// Do some stuff here!
	}

	public render() {
		const { settings } = this.state;

		return <h1>hello3</h1>;
	}
}

render(<Popup />, document.body);
