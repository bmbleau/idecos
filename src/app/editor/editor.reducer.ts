// counter.ts
import { ActionReducer, Action } from '@ngrx/store';
import { EditorState } from './editor.state';

export const EDITOR_DIRECTORY_LOAD = 'editor:directory:load';
export const EDITOR_LANGUAGE_UPDATE = 'editor:language:update';
export const EDITOR_CODE_UPDATE = 'editor:code:update';

export function editorReducer(state: EditorState = new EditorState(), action: Action) {
	switch (action.type) {
	  case EDITOR_LANGUAGE_UPDATE: {
	    return Object.assign(new EditorState(), state, {
	      language: action.payload,
	    });
	  }
	  
	  case EDITOR_CODE_UPDATE: {
	    return Object.assign(new EditorState(), state, {
	      code: action.payload,
	    });
	  }
	  
	  case EDITOR_DIRECTORY_LOAD: {
	    return Object.assign(new EditorState(), state, {
	      directory: action.payload,
	    });
	  }

		default: {
		  return state;
		}
	}
}