const ratting = (r) => {
    const rattingInt = Number.parseInt(r);
    const rattingFloat = r - rattingInt;
    let roundOfRatting = rattingInt;
    if (rattingFloat > .1 && rattingFloat < .4) {
        roundOfRatting += .5;
        return roundOfRatting;
    }
    if (rattingFloat > .6 && rattingFloat < .9) {
        roundOfRatting += 1;
        return roundOfRatting;
    }
    return r;
}
export { ratting }
