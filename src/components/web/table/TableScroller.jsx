var TableScroller = {

    registerScrollEvent() {
        this.refs.body.addEventListener('scroll', this.handleScroll.bind(this));
    },

    unregisterScrollEvent() {
        this.refs.body.removeEventListener('scroll', this.handleScroll.bind(this));
    },

    handleScroll(e) {
        const isAtBottom = e.target.scrollTop + this.refs.body.clientHeight == e.target.scrollHeight;
        if (isAtBottom) {
            this.say('needMoreData');
        }
    }
};

export {TableScroller as default};
