import { Editor, Plugin} from 'obsidian';

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

					let prevChar = currentLineStr.charAt( editor.getCursor().ch-1 );
					let currentMode = NORMAL_CHAR_WORD;

					// first skip initial whitespaces
					while ( prevChar == " ") {

						navPrevChar(editor);

						prevChar = currentLineStr.charAt( editor.getCursor().ch-1 );
					}

					if ( !isNormalChar(prevChar) ) currentMode = SPECIAL_CHAR_WORD;

					// skip characters until hit a special one or vice versa
					while ( currentMode == isNormalChar( prevChar ) && prevChar != " ") {

						navPrevChar(editor);

						prevChar = currentLineStr.charAt( editor.getCursor().ch-1 )
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

					let cursor = editor.getCursor()

					let line = editor.getLine( cursor.line )

					const SPECIAL_CHAR_WORD = 0
					const NORMAL_CHAR_WORD = 1

					let currentMode = NORMAL_CHAR_WORD

					let followingChar = line.charAt(cursor.ch)
					let nextCursor = editor.getCursor()

					// checking if we are at the last index of the line or one before
					// if yes, then we only need to delete one char forward (could be the next line)
					if ( line.length <= cursor.ch || line.length <= cursor.ch +1 ) {

						deleteNextChar(editor)
						return
					}

					if (line.charAt( nextCursor.ch+1 ) == " " ) {

						nextCursor.ch ++

						while (line.charAt( nextCursor.ch ) == " " ) {

							nextCursor.ch ++
						}
						nextCursor.ch--;

						editor.replaceRange( "", cursor, nextCursor)

						print("replaced indexes " + cursor.ch + " to " + nextCursor.ch + " with nothing")
						return
					}


					 if ( followingChar == " " ) {

						 nextCursor.ch++;
						 followingChar = line.charAt(nextCursor.ch)
					 }

					 if ( !isNormalChar(followingChar) ) currentMode = SPECIAL_CHAR_WORD;

					while ( currentMode == isNormalChar( followingChar )
					&& followingChar != " "
					&& line.length > nextCursor.ch) {

						nextCursor.ch++
						followingChar = line.charAt(nextCursor.ch)
					}
					editor.replaceRange( "", cursor, nextCursor)

				}
				repeatUntilKeyUp(code, this)
			}
		})

		this.addCommand({
			id: 'delete-previous-word',
			name: 'Delete previous word',
			editorCallback: (editor: Editor) => {

				/* METHOD
				* 2 modes, special char mode (no 0) and normal char mode (no 1).
				* skip white spaces only as first chars otherwise stop
				* */
				function code(): void {

					let cursor = editor.getCursor()

					let line = editor.getLine( cursor.line )

					const SPECIAL_CHAR_WORD = 0
					const NORMAL_CHAR_WORD = 1

					let currentMode = NORMAL_CHAR_WORD

					let prevChar = line.charAt( cursor.ch-1 )
					let prevCursor = editor.getCursor()

					// checking if we are at the last index of the line or one before
					// if yes, then we only need to delete one char forward (could be the next line)
					if ( 0 == cursor.ch || 0 == cursor.ch -1 ) {

						deletePrevChar(editor)
						return
					}

					if (line.charAt( prevCursor.ch ) == " " ) {

						prevCursor.ch --

						while (line.charAt( prevCursor.ch ) == " " ) {

							prevCursor.ch --
						}
						prevCursor.ch++;

						editor.replaceRange( "", prevCursor, cursor)

						print("replaced indexes " + cursor.ch + " to " + prevCursor.ch + " with nothing")
						return
					}


					if ( prevChar == " " ) {

						prevCursor.ch--;
						prevChar = line.charAt(prevCursor.ch-1)
					}

					if ( !isNormalChar(prevChar) ) currentMode = SPECIAL_CHAR_WORD;

					while ( currentMode == isNormalChar( prevChar )
					&& prevChar != " "
					&& 0 < prevCursor.ch) {

						prevCursor.ch--
						prevChar = line.charAt(prevCursor.ch-1)
					}
					editor.replaceRange( "", prevCursor, cursor)
					print("replaced indexes " + cursor.ch + " to " + prevCursor.ch + " with nothing")

				}
				repeatUntilKeyUp(code, this)
			}
		})

		this.addCommand({
			id: 'navigate-line-up',
			name: 'Navigate line up',
			editorCallback: editor => {

				function code(): void {

					editor.exec('goUp')
				}
				repeatUntilKeyUp(code, this)
			}
		})

		this.addCommand({
			id: 'navigate-line-down',
			name: 'Navigate line down',
			editorCallback: editor => {

				function code(): void {

					editor.exec('goDown')
				}
				repeatUntilKeyUp(code, this)
			}
		})

		this.addCommand({
			id: 'new-line',
			name: 'New Line',
			editorCallback: editor => {

				function code(): void {

					editor.exec('newlineAndIndent')
				}
				repeatUntilKeyUp(code, this)
			}
		})

		this.addCommand({
			id: 'start-new-line',
			name: 'Start New Line',
			editorCallback: editor => {

				function code(): void {

					let cursor = editor.getCursor()
					let line = editor.getLine( cursor.line )

					editor.setCursor(cursor.line, line.length)
					editor.exec('newlineAndIndent')
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
		await delay(40)
		code()
		count++
		print("repeat")
	}
}

function print(str: any) {

	console.log(str)
}
