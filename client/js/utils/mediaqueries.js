const desktopBreakpoint = 840;
const tabletBreakpoint = 480;

export const mqlPhone = window.matchMedia(
  `screen and (max-width: ${tabletBreakpoint-1}px)`
);
export const mqlTablet = window.matchMedia (
  `screen and (mac-width: ${desktopBreakpoint-1}px)`
);

