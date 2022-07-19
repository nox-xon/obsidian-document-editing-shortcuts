import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'navigate-to-next-character',
			name: 'Navigate to next character',
			editorCallback: (editor: Editor) => {

				function code(): void {
					navNextChar(editor)
				}

				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'navigate-to-previous-character',
			name: 'Navigate to previous character',
			editorCallback: (editor: Editor) => {

				function code(): void {
					navPrevChar(editor)
				}

				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'navigate-to-next-word',
			name: 'Navigate to next word',
			editorCallback: (editor: Editor) => {

				/* METHOD
				* 2 modes, special char mode (no 0) and normal char mode (no 1).
				* skip white spaces only as first chars otherwise stop
				* */
				function code(): void {

					const SPECIAL_CHAR_WORD = 0
					const NORMAL_CHAR_WORD = 1

					let currentLineStr = editor.getLine(editor.getCursor().line)

					// check if at the end of line
					if ( currentLineStr.length <= editor.getCursor().ch ) {

						navNextChar(editor) // moves to next line

						return
					}

					let followingChar = currentLineStr.charAt( editor.getCursor().ch );
					let currentMode = NORMAL_CHAR_WORD;

					// first skip initial whitespaces
					while ( followingChar == " ") {

						navNextChar(editor);

						followingChar = currentLineStr.charAt( editor.getCursor().ch );
					}

					if ( !isNormalChar(followingChar) ) currentMode = SPECIAL_CHAR_WORD;

					// skip characters until hit a special one or vice versa
					while ( currentMode == isNormalChar( followingChar ) && followingChar != " ") {

						navNextChar(editor);

						followingChar = currentLineStr.charAt( editor.getCursor().ch )
					}
				}
				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'navigate-to-previous-word',
			name: 'Navigate to previous word',
			editorCallback: (editor: Editor) => {

				/* METHOD
				* 2 modes, special char mode (no 0) and normal char mode (no 1).
				* skip white spaces only as first chars otherwise stop
				* */
				function code(): void {

					const SPECIAL_CHAR_WORD = 0
					const NORMAL_CHAR_WORD = 1

					let currentLineStr = editor.getLine(editor.getCursor().line)

					// check if at the end of line
					if (  editor.getCursor().ch == 0 ) {

						navPrevChar(editor) // moves to next line
						return
					}

					let followingChar = currentLineStr.charAt( editor.getCursor().ch-1 );
					let currentMode = NORMAL_CHAR_WORD;

					// first skip initial whitespaces
					while ( followingChar == " ") {

						navPrevChar(editor);

						followingChar = currentLineStr.charAt( editor.getCursor().ch-1 );
					}

					if ( !isNormalChar(followingChar) ) currentMode = SPECIAL_CHAR_WORD;

					// skip characters until hit a special one or vice versa
					while ( currentMode == isNormalChar( followingChar ) && followingChar != " ") {

						navPrevChar(editor);

						followingChar = currentLineStr.charAt( editor.getCursor().ch-1 )
					}
				}
				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'delete-next-character',
			name: 'Delete next character',
			editorCallback: (editor: Editor) => {

				function code(): void {

					deleteNextChar(editor)
				}

				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'delete-previous-char',
			name: 'Delete previous character',
			editorCallback: (editor: Editor) => {

				function code(): void {

					deletePrevChar(editor)
				}

				repeatUntilKeyUp(code, this)
			}
		});

		this.addCommand({
			id: 'delete-next-word',
			name: 'Delete next word',
			editorCallback: (editor: Editor) => {

				/* METHOD
				* 2 modes, special char mode (no 0) and normal char mode (no 1).
				* skip white spaces only as first chars otherwise stop
				* */
				function code(): void {

					const SPECIAL_CHAR_WORD = 0
					const NORMAL_CHAR_WORD = 1

					let currentLineStr = editor.getLine(editor.getCursor().line)

					// check if at the end of line
					if ( currentLineStr.length <= editor.getCursor().ch ) {

						deleteNextChar(editor) // moves to next line

						return
					}

					let followingChar = currentLineStr.charAt( editor.getCursor().ch );
					let currentMode = NORMAL_CHAR_WORD;

					// first skip initial whitespaces
					while ( followingChar == " ") {

						deleteNextChar(editor);

						followingChar = currentLineStr.charAt( editor.getCursor().ch );
					}

					if ( !isNormalChar(followingChar) ) currentMode = SPECIAL_CHAR_WORD;

					// skip characters until hit a special one or vice versa
					while ( currentMode == isNormalChar( followingChar ) && followingChar != " ") {

						deleteNextChar(editor);

						followingChar = currentLineStr.charAt( editor.getCursor().ch )
					}
				}
				repeatUntilKeyUp(code, this)
			}
		})
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// global functions

function isNormalChar(char: string): number {

	if ( "~`!@#$%^&*()-_=+\\|]}[{'\";:/?.>,<".includes(char) ) return 0
	return 1
}

function navPrevChar(editor: Editor) {

	let cursorLocationBefore = editor.getCursor()

	if (editor.getCursor().ch == 0) {

		editor.setCursor( cursorLocationBefore.line - 1, editor.getLine(cursorLocationBefore.line - 1).length )

	} else {

		editor.setCursor( cursorLocationBefore.line, cursorLocationBefore.ch - 1 );
	}
}

function navNextChar(editor: Editor) {

	let cursorLocationBefore = editor.getCursor()
	editor.setCursor( cursorLocationBefore.line, cursorLocationBefore.ch + 1 );
}

function deletePrevChar(editor: Editor) {

	if ( editor.getSelection().length > 0 ) {

		editor.replaceSelection("")
		return
	}

	let cursorLocation = editor.getCursor()
	let cursorPrevious = editor.getCursor()
	cursorPrevious.ch -= 1

	// for some reason it hits an error when deleting at the beginning,
	// I had to add this if statement to fix that and delete the line that way
	if ( cursorPrevious.ch <= -1 ) {

		cursorPrevious.line --;
		cursorPrevious.ch = editor.getLine(cursorPrevious.line).length;
	}
	editor.replaceRange("", cursorPrevious, cursorLocation)
}

function deleteNextChar(editor: Editor) {

	if ( editor.getSelection().length > 0 ) {

		editor.replaceSelection("")
		return
	}

	let cursorLocation = editor.getCursor()
	let cursorNext = editor.getCursor()
	cursorNext.ch += 1
	editor.replaceRange("", cursorLocation, cursorNext )
}

async function delay(ms: number) {

	return new Promise( resolve => setTimeout(resolve, ms) );
}

async function repeatUntilKeyUp(code: Function, context: Plugin) {

	let yes = true

	context.registerDomEvent(document, 'keyup', () => {

		yes = false;
	})

	code()
	await delay(500)
	let count = 0
	while (yes) {
		await delay(30)
		code()
		count++
		print("repeat")
	}
}

function print(str: any) {

	console.log(str)
}
