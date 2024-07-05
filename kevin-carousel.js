class KevinCarousel{
    
    constructor(carousel){
        this.carousel = document.querySelector(carousel);
        this.stageOuter = null;
        this.stage = null;
        this.responsive = {};
        // Show buttons next/previous
        this.button = false;
        // If the user can drag the carousel
        this.draggable = true;
        // The user want to drag the carousel
        this.isDragged = false;
        // Space between each item
        this.gap = 10;
        // Amount of real image
        this.originalItems = 0;
        // Items the user can see once
        this.items = 3;
        // Width of items
        this.widthItem = 0;
        // Auto move the carousel
        this.loop = true;
        // Pause the loop when hover the carousel
        this.pauseLoopOnHover = true;
        // Time for the loop in milliseconde
        this.timeInterval = 1800;
        // Transition time for item in milliseconde
        this.transitionTime = 250;
        // ID of the loop
        this.idInterval = -1;
        this.baseTranslateX = 0;
        this.currentTranslateX = 0;
        // For the drag
        this.prevTranslateX = 0;
        // Get the pos x of the mouse for drag the carousel
        this.previousPosXMouse = 0;
    }

    init(options){
        this.initOptions(options);
        this.checkResponsive();
        
        this.initListener();
        this.initListenerCarousel(this.carousel);
        this.initOriginalItems(this.carousel);
        this.initStageOuter();
        this.initStage(this.carousel, this.stageOuter);
        this.initSizeItem(this.stageOuter);
        this.initListenerStageOuter(this.stageOuter);
        this.initClassNames(this.stage);
        this.createClone(this.stage);
        this.initTranslate(this.stage);
        this.initGap(this.stage);
        this.initListenerStageOuter(this.stageOuter);
        this.initCancelDragItem();
        this.initButton();

        this.startLoop();
    }

    initOptions(options){
        this.setItems(options.items);
        this.setPauseLoopOnHover(options.pauseLoopOnHover);
        this.setButton(options.button);
        this.setGap(options.gap);
        this.setLoop(options.loop);
        this.setTimeInterval(options.loopTime);
        this.setTransitionTime(options.transitionTime);
        this.setDraggable(options.draggable);
        this.setResponsive(options.responsive);
    }

    checkResponsive(){
        let toResponsive = null;
        let higherWidth = 0;
        for (let options in this.responsive) {
            options = +options;
            if(higherWidth > options || options > window.innerWidth) continue;
            higherWidth = options;
            toResponsive = this.responsive[options];
        }
        if(toResponsive === null) return;
        this.initOptions(toResponsive);
    }

    setResponsive(responsive){
        if(responsive === undefined) return;
        if(typeof responsive !== 'object' || Array.isArray(responsive) || responsive === null) throw new Error('The responsive need to be a object !');
        
        for (let options in responsive) {
            if(isNaN(options)) throw new Error('The responsive key need to be a integer !');
            const optionsValue = responsive[options];
            if(typeof optionsValue !== 'object' || Array.isArray(optionsValue) || optionsValue === null) throw new Error('The responsive value need to be a object !');
        }

        this.responsive = responsive;
    }

    setItems(items){
        if(items === undefined) return;
        if(isNaN(items)) throw new Error('The items need to be a integer !');
        if(items < 1) throw new Error('The items can not be lower than 1 !');
        this.items = items;
    }    

    setButton(button){
        if(button === undefined) return;
        if(typeof button != "boolean") throw new Error('The button need to be a boolean !');
        this.button = button;
    }

    setPauseLoopOnHover(pauseLoopOnHover){
        if(pauseLoopOnHover === undefined) return;
        if(typeof pauseLoopOnHover != "boolean") throw new Error('The pauseLoopOnHover need to be a boolean !');
        this.pauseLoopOnHover = pauseLoopOnHover;
    }

    setTransitionTime(transitionTime){
        if(transitionTime === undefined) return;
        if(isNaN(transitionTime)) throw new Error('The transitionTime need to be a integer !');
        if(transitionTime < 1) throw new Error('The transitionTime can not be lower than 1 !');
        this.transitionTime = transitionTime;
    }

    setTimeInterval(timeInterval){
        if(timeInterval === undefined) return;
        if(isNaN(timeInterval)) throw new Error('The loopTime need to be a integer !');
        if(timeInterval < 1) throw new Error('The loopTime can not be lower than 1 !');
        this.timeInterval = timeInterval;
    }

    setLoop(loop){
        if(loop === undefined) return;
        if(typeof loop != "boolean") throw new Error('The loop need to be a boolean !');
        this.loop = loop;
    }

    setGap(gap){
        if(gap === undefined) return;
        if(isNaN(gap)) throw new Error('The gap need to be a integer !');
        this.gap = gap;
    }

    setDraggable(draggable){
        if(draggable === undefined) return;
        if(typeof draggable != "boolean") throw new Error('The draggable need to be a boolean !');
        this.draggable = draggable;
    }

    moveItem(stageOuter, toTheRight = true, fast = false){
        const stage = stageOuter.querySelector('.kevin-stage');
        if(toTheRight) this.currentTranslateX -= this.gap + this.widthItem;
        else this.currentTranslateX += this.gap + this.widthItem;
        const check = this.checkCurrentTranslateX();
        if(!check){
            stage.style.transition = "all 0s";
            this.translateStage(stage);
            setTimeout(() => {
                if(toTheRight) this.currentTranslateX -= this.gap + this.widthItem;
                else this.currentTranslateX += this.gap + this.widthItem;
                stage.style.transition = `all ${fast ? 150 : this.transitionTime}ms`;
                this.translateStage(stage);
            }, 1);
        }else{
            if(fast){
                stage.style.transition = `all 150ms`;
                setTimeout(() => {
                    stage.style.transition = `all ${this.transitionTime}ms`;
                }, 1);
            }
            this.translateStage(stage);
        }
    }

    startLoop(){
        if(!this.loop) return;
        this.idInterval = setInterval(() => {
            this.moveItem(this.stageOuter, true);
        }, this.timeInterval);
    }

    initButton(){
        if(!this.button) return;
        const leftArrow = document.createElement('span');
        leftArrow.onclick = this.previousItem.bind(this, this.stageOuter);
        leftArrow.textContent = "‹"

        const rightArrow = document.createElement('span');
        rightArrow.onclick = this.nextItem.bind(this, this.stageOuter);
        rightArrow.textContent = "›";

        const nav = document.createElement('div');
        nav.classList.add('kevin-nav');

        nav.append(leftArrow, rightArrow);

        this.carousel.append(nav);
        
    }

    initGap(stage){
        stage.querySelectorAll('.kevin-item').forEach(item=>item.style.marginRight = this.gap + 'px');
    }

    initOriginalItems(carousel){
        this.originalItems = carousel.querySelectorAll('.item').length;
    }

    initCancelDragItem(){
        this.carousel.querySelectorAll('.kevin-item').forEach(item=>item.addEventListener('dragstart', e=>e.preventDefault()));
    }

    initStageOuter(){
        const stageOuter = document.createElement('div');
        stageOuter.classList.add('kevin-stage-outer');
        this.stageOuter = stageOuter;
    }

    initStage(carousel, stageOuter){
        const stage = document.createElement('div');
        stage.classList.add('kevin-stage');
        stage.append(...carousel.children);
        stageOuter.append(stage);
        carousel.append(stageOuter);
        this.stage = stage;
    }

    initClassNames(stage){
        const children = stage.querySelectorAll('.item');
        children.forEach(child=>{
            child.classList.replace('item', 'kevin-item');
        });
    }

    initTranslate(stage){
        const widthItem = +stage.querySelector('.kevin-item').style.minWidth.replace('px', '');
        const translateX = widthItem * this.items + this.items * this.gap;
        stage.style.translate = -translateX + "px 0px";
        this.baseTranslateX = -translateX;
        this.currentTranslateX = -translateX;
        setTimeout(() => {
            stage.style.transition = `all ${this.transitionTime}ms`;
        }, 1);
    }

    createClone(stage){
        const children = stage.querySelectorAll('.kevin-item');
        const clonesAfter = [];
        const clonesBefore = [];
        for(let i = 0; i < this.items; ++i){
            let clone = children[i].cloneNode(true);
            clone.classList.add('cloned');
            clonesAfter.push(clone);
            clone = children[children.length - i - 1].cloneNode(true);
            clone.classList.add('cloned');
            clonesBefore.push(clone);
        }
        stage.append(...clonesAfter);
        stage.prepend(...clonesBefore.reverse());

    }

    initSizeItem(stageOuter){
        const width = (+stageOuter.getBoundingClientRect().width) - (this.items - 1) * this.gap;
        this.widthItem = width / this.items;
        stageOuter.querySelector('.kevin-stage').querySelectorAll('.item').forEach(item=>item.style.minWidth = this.widthItem + 'px');
    }

    initListener(){
        addEventListener('resize', ()=>{
            this.initSizeItem(this.stageOuter);
            this.checkResponsive();
        })
    }

    initListenerCarousel(carousel){
        if(this.pauseLoopOnHover){
            carousel.addEventListener('mouseenter', ()=>{
                clearInterval(this.idInterval);
                this.idInterval = -1;
            });
            carousel.addEventListener('mouseleave', ()=>{
                if(this.idInterval === -1)
                    this.startLoop();
            });
        }
    }

    initListenerStageOuter(stageOuter){
        if(this.draggable){
            const stage = stageOuter.querySelector('.kevin-stage');
            
            stageOuter.addEventListener('mousemove', event=>{
                if(!this.isDragged) return;
                this.currentTranslateX = this.prevTranslateX + (event.clientX - this.previousPosXMouse);
                const check = this.checkCurrentTranslateX();
                if(!check)
                    this.previousPosXMouse = event.clientX;
                this.translateStage(stage);
            });
            stageOuter.addEventListener('mousedown', (e)=>{
                this.isDragged = true;
                stage.style.transition = "all 0s";
                stageOuter.style.cursor = 'grab';
                this.previousPosXMouse = e.clientX;
                this.prevTranslateX = this.currentTranslateX;
            });
            stageOuter.addEventListener('mouseleave', stopDrag.bind(this));
            stageOuter.addEventListener('mouseup', stopDrag.bind(this));
            
            function stopDrag(){
                this.isDragged = false;
                stage.style.transition = `all ${this.transitionTime}ms`;
                stageOuter.style.cursor = 'default';
                const nearestIndex = Math.round(-this.currentTranslateX / (this.widthItem + this.gap));
                this.currentTranslateX = -nearestIndex * (this.widthItem + this.gap);
                this.translateStage(stage); 
            }
        }

    }

    translateStage(stage){
        stage.style.translate = this.currentTranslateX + 'px 0px';
    }

    previousItem(stageOuter){
        this.moveItem(stageOuter, false, true);
    }
    
    nextItem(stageOuter){
        this.moveItem(stageOuter, true, true);
    }

    /**
     * 
     * @returns boolean if true there is no problem, if false the value has been reset
     */
    checkCurrentTranslateX(){
        // right side
        if(this.isCurrentTranslateXOutOfBoundsRight()){
            this.setCurrentTranslateXResetRight();
            return false;
        }
        // left side
        else if(this.isCurrentTranslateXOutOfBoundsLeft()){
            this.setCurrentTranslateXResetLeft();
            return false;
        }

        return true;
    }

    isCurrentTranslateXOutOfBoundsRight(){
        return this.currentTranslateX < (this.baseTranslateX - (this.originalItems - this.items) * this.widthItem) - (this.items + 1) * this.gap - (this.items) * this.widthItem;
    }

    isCurrentTranslateXOutOfBoundsLeft(){
        return this.currentTranslateX > this.baseTranslateX + (this.items) * this.gap + (this.items) * this.widthItem;
    }

    setCurrentTranslateXResetRight(){
        this.currentTranslateX = this.baseTranslateX;
        this.prevTranslateX = this.currentTranslateX;
    }

    setCurrentTranslateXResetLeft(){
        this.currentTranslateX = (this.baseTranslateX - (this.originalItems - this.items) * this.widthItem) - this.gap;
        this.prevTranslateX = this.currentTranslateX;
    }

}