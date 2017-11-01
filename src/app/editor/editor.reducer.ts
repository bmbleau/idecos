// counter.ts
import { ActionReducer, Action } from '@ngrx/store';
import { EditorState } from './editor.state';

export const EDITOR_DIRECTORY_LOAD = 'editor:directory:load';
export const EDITOR_DIRECTORY_UNLOAD = 'editor:directory:unload';
export const EDITOR_TAB_ADD = 'editor:tab:add';
export const EDITOR_TAB_UPDATE = 'editor:tab:update';
export const EDITOR_TAB_REMOVE = 'editor:tab:remove';
export const EDITOR_TAB_SELECT = 'editor:tab:select';

export function editorReducer(state: EditorState = new EditorState(), action: Action) {
	switch (action.type) {
	  
	  case EDITOR_TAB_UPDATE: {
	    // Only update the contents of the file if it has actually changed.
	    if (state.tabs[state.selectedTab].contents !== action.payload) {
	      const tabs = state.tabs.slice(0);
  	    tabs[state.selectedTab].contents = action.payload;
  	    
  	    return Object.assign(new EditorState(), state, {
  	      tabs,
  	    });
	    }
	    
	    return state;
	  }

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
	  
	  case EDITOR_DIRECTORY_UNLOAD: {
	    const newState = Object.assign(new EditorState(), state);
	    newState.directory = undefined;
	    return newState;
	  }

		default: {
		  return state;
		}
	}
}