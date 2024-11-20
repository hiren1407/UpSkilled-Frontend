import appReducer, { toggleMenu, closeMenu, openMenu } from '../../utils/appSlice';

describe('appSlice', () => {
  const initialState = {
    isMenuOpen: false,
  };

  it('should return the initial state when passed an empty action', () => {
    const result = appReducer(undefined, { type: undefined });
    expect(result).toEqual(initialState);
  });

  it('should toggle isMenuOpen when toggleMenu is dispatched', () => {
    const state = { isMenuOpen: false };

    // Toggle from false to true
    const toggledState = appReducer(state, toggleMenu());
    expect(toggledState.isMenuOpen).toBe(true);

    // Toggle back from true to false
    const toggledBackState = appReducer(toggledState, toggleMenu());
    expect(toggledBackState.isMenuOpen).toBe(false);
  });

  it('should set isMenuOpen to false when closeMenu is dispatched', () => {
    const state = { isMenuOpen: true };

    const newState = appReducer(state, closeMenu());
    expect(newState.isMenuOpen).toBe(false);
  });

  it('should set isMenuOpen to true when openMenu is dispatched', () => {
    const state = { isMenuOpen: false };

    const newState = appReducer(state, openMenu());
    expect(newState.isMenuOpen).toBe(true);
  });
});
