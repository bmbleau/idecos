// counter.ts
import { ActionReducer, Action } from '@ngrx/store';
import { EditorState } from './editor.state';

export const EDITOR_DIRECTORY_LOAD = 'editor:directory:load';
export const EDITOR_TAB_ADD = 'editor:tab:add';
export const EDITOR_TAB_REMOVE = 'editor:tab:remove';
export const EDITOR_TAB_SELECT = 'editor:tab:select';

export function editorReducer(state: EditorState = new EditorState(), action: Action) {
	switch (action.type) {

	  case EDITOR_TAB_ADD: {
	    const tabs = state.tabs.slice(0);
	    tabs.push(action.payload);

	    return Object.assign(new EditorState(), state, {
	      tabs
	    });
	  }
	  
	  case EDITOR_TAB_REMOVE: {
	    // Should we be on the last tab and that tab not be position zero,
	    // we need to reduce the selected tab index by one to go to the
	    // new last tab.
	    let selectedTab = state.selectedTab;
	    if (action.payload && (state.tabs.length - 1) === action.payload) {
	      selectedTab = action.payload - 1;
	    }

	    const tabs = state.tabs
	      .filter((tab, index) => index !== action.payload);

	    return Object.assign(new EditorState(), state, {
	      tabs,
	      selectedTab,
	    });
	  }
	  
	  case EDITOR_TAB_SELECT: {
	    return Object.assign(new EditorState(), state, {
	      selectedTab: action.payload,
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