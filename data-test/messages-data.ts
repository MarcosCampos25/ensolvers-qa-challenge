export type ColorRange = {
    r: [number, number];
    g: [number, number];
    b: [number, number];
  };

export const errorMessageColorRange: ColorRange = {
    r: [150, 255],
    g: [0, 100],
    b: [0, 100],
};

export const successMessageColorRange: ColorRange = {
    r: [0, 150],
    g: [150, 255],
    b: [0, 150],
};

export const errorMessageToIvalidLogin = 'Failed to sign in! Please check your credentials and try again.'
export const succesMessageToValidLogin = 'You are logged in as'