# Obsidian Document Editing Shortcuts

This plugin tries to take basic document editing shortcuts as well as advanced IDE's and implements those in Obsidian.

It's an ongoing project, so expect more polish and shortcuts added in the future. Feel free to contribute or make requests, even if what you need is already in the todo list, it will help prioritise what to work on and add first.

## Shortcuts

All shortcuts will `repeat` if you hold the buttons you mapped to perform them.
Here's what's completed and needs to be done

### Done
* [x] Navigate one character right and left
* [x] Navigate one word right and left
* [x] Delete one character right and left
* [x] Delete one word right and left
* [x] Navigate up and down
* [x] Add new line (Enter)
* [x] Start new line (this creates a new line below the cursor and navigates there without splitting)

### Todo
* [ ] Navigate up down left right with selection
* [ ] Navigate one word left and right with selection
* [ ] Navigate to end and start of line (not the markdown line, the normal line)
* [ ] Navigate to end and start of line with selection
* [ ] Delete line
* [ ] Delete line left and right from cursor
* [ ] Extend selection (selects word left and right and extends the more you press, similar to how Intellij works)
* [ ] Expand and collapse file explorer
* [ ] Navigate up and down, open and close directories in file explorer
* [ ] Add a setting to adjust repeat delays for each shortcut
* [ ] Navigate to next and previous heading
* [ ] Navigate a defined (in settings) amount of lines up and down
* [ ] All document navigation settings for line up and down should have a companion shortcut to scroll with the cursor
* [ ] Scroll up and down
* [ ] Center scroll relative to cursor
* [ ] Toggle right click menu with keyboard shortcut
* [ ] Navigate up, down and select inside right click menu
* [ ] Toggle command platte (you can only open it with shortcut but not close it)
* [ ] Navigate up, down and select inside command platte menu
* [ ] More to be added ...

Something to note is that it's not entirely clear how simple it is to code some of the shortcuts inside the todo list.

## Clean Ups & Polish
When I frist started coding the plugin, I didn't know anything about the Editor API so that naively had me code many of these functions from scratch. Some weren't in the API though.

1. Those functions that already exist in the Editor API need to be changed to implement that API rather than the manual functions I coded.
2. Functions that are coded manually should be moved to another typescript file according to the catergory, maybe even inside classes. Dunno yet. but at the moment it's starting to look too unorganised to put everything as functions in 1 file

## Installation
### Install from Community Plugins
Can't do that yet, waiting for approval. Hopefully it will get approved soon.
Till then a manual installation is required.

### Manual Installation
* Download manifest.json and main.js from the releases inside this repo.
* Go inside your vault directory.
* Show hidden files and folder (Google it).
* Go inside the .obsidian directory.
* If there is a directory called "plugins" go inside it, if not create one with that exact name and enter it.
* Inside the plugins directory, create a new directory called "document-editing-shortcuts".
* Place the manifest.json and main.js files inside the "document-editing-shortcuts" directory you just created.
* Start or restart Obsidian and it should be in the community plugins tab inside settings.
