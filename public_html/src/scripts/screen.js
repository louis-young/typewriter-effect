/**
 * Screen class.
 */

class Screen {
    /**
     * Render method.
     *
     * @param value
     */

    render(value) {
        this.element.innerText = value;
    }
}

export const Screen = new Screen();