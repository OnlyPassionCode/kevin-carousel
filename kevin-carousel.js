class KevinCarousel{
    
    constructor(carousels){
        this.carousels = document.querySelectorAll(carousels);
        // If the user can drag the carousel
        this.draggable = true;
        // The user want to drag the carousel
        this.isDragged = false;
        // Space between each item
        this.gap = 10;
        // Items the user can see once
        this.items = 3;
        // Width of items
        this.widthItem = 0;
        // Auto move the carousel
        this.loop = true;
        // Time for the loop
        this.timeInterval = 1800;
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
        this.setItems(options.items);
        this.initListener();
        this.setDraggable(options.draggable);
        this.carousels.forEach(carousel=>{
            const stageOuter = this.initStageOuter();
            this.initStage(carousel, stageOuter);
            this.setSizeItem(stageOuter);
            this.initListenerStageOuter(stageOuter);
        });
        this.stages.forEach(stage=>{
            this.initClassNames(stage);
            this.setGap(stage, options.gap);
            this.createClone(stage);
            this.initTranslate(stage);
        });
        this.stagesOuter.forEach(this.initListenerStageOuter.bind(this));
        this.initCancelDragItem();
        this.setLoop(options.loop);
        
        this.startLoop();
    }

    setItems(items){
        if(items === undefined) return;
        if(!Number.isInteger(items)) throw new Error('The items need to be a integer !');
        if(items < 1) throw new Error('The items can not be lower than 1 !');
        this.items = items;
    }

    setLoop(loop){
        if(loop === undefined) return;
        if(typeof loop != "boolean") throw new Error('The loop need to be a boolean !');
        this.loop = loop;
    }

    setGap(stage, gap){
        if(gap === undefined) return;
        if(!Number.isInteger(gap)) throw new Error('The gap need to be a integer !');
        this.gap = gap;
        stage.querySelectorAll('.kevin-item').forEach(item=>item.style.marginRight = this.gap + 'px');
    }

    setDraggable(draggable){
        if(draggable === undefined) return;
        if(typeof draggable != "boolean") throw new Error('The draggable need to be a boolean !');
        this.draggable = draggable;
    }

    startLoop(){
        if(!this.loop) return;
        this.idInterval = setInterval(() => {
            this.stagesOuter.forEach(stageOuter=>{
                const stage = stageOuter.querySelector('.kevin-stage');
                this.currentTranslateX -= this.gap + this.widthItem;
                const check = this.checkCurrentTranslateX();
                if(!check){
                    stage.style.transition = "all 0s";
                    this.translateStage(stage);
                    setTimeout(() => {
                        this.currentTranslateX -= this.gap + this.widthItem;
                        stage.style.transition = "all 0.25s";
                        this.translateStage(stage);
                    }, 0);
                }else this.translateStage(stage);
            });
        }, this.timeInterval);
    }

    initCancelDragItem(){
        this.carousels.forEach(carousel=>carousel.querySelectorAll('.kevin-item').forEach(item=>item.addEventListener('dragstart', e=>e.preventDefault())));
    }

    initStageOuter(){
        if(this.stagesOuter === undefined) 
            this.stagesOuter = [];
        const stageOuter = document.createElement('div');
        stageOuter.classList.add('kevin-stage-outer');
        this.stagesOuter.push(stageOuter);
        return stageOuter;
    }

    initStage(carousel, stageOuter){
        if(this.stages === undefined) 
            this.stages = [];
        const stage = document.createElement('div');
        stage.classList.add('kevin-stage');
        stage.append(...carousel.children);
        stageOuter.append(stage);
        carousel.append(stageOuter);
        this.stages.push(stage);
    }

    initClassNames(stage){
        const children = stage.querySelectorAll('.item');
        children.forEach(child=>{
            child.classList.replace('item', 'kevin-item');
        });
    }

    initTranslate(stage){
        const widthItem = +stage.querySelector('.kevin-item').style.minWidth.replace('px', '');
        const translateX = widthItem * 3 + this.items * this.gap;
        stage.style.translate = -translateX + "px 0px";
        this.baseTranslateX = -translateX;
        this.currentTranslateX = -translateX;
        setTimeout(() => {
            stage.style.transition = "all 0.25s";
        }, 0);
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

    setSizeItem(stageOuter){
        const width = (+stageOuter.getBoundingClientRect().width) - this.gap;
        this.widthItem = width / this.items;
        stageOuter.querySelector('.kevin-stage').querySelectorAll('.item').forEach(item=>item.style.minWidth = this.widthItem + 'px');
    }

    initListener(){
        addEventListener('resize', ()=>{
            this.stagesOuter.forEach(this.setSizeItem.bind(this));
        })
    }

    initListenerStageOuter(stageOuter){
        // If the user specify in the option that he cant drag the carousel
        if(!this.draggable) return;

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
            clearInterval(this.idInterval);
        });
        stageOuter.addEventListener('mouseleave', ()=>{
            this.isDragged = false;
            stage.style.transition = "all 0.25s";
            stageOuter.style.cursor = 'default';
        });
        stageOuter.addEventListener('mouseup', ()=>{
            this.isDragged = false;
            stage.style.transition = "all 0.25s";
            stageOuter.style.cursor = 'default';
        });
    }

    translateStage(stage){
        stage.style.translate = this.currentTranslateX + 'px 0px';
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
        return this.currentTranslateX < this.baseTranslateX - (this.items - 1) * this.gap - (this.items - 1) * this.widthItem;
    }

    isCurrentTranslateXOutOfBoundsLeft(){
        return this.currentTranslateX > this.baseTranslateX + (this.items - 1) * this.gap + (this.items - 1) * this.widthItem;
    }

    setCurrentTranslateXResetRight(){
        this.currentTranslateX = this.baseTranslateX + 1 * this.widthItem + this.gap;
        this.prevTranslateX = this.currentTranslateX;
    }

    setCurrentTranslateXResetLeft(){
        this.currentTranslateX = this.baseTranslateX - 1 * this.widthItem - this.gap;
        this.prevTranslateX = this.currentTranslateX;
    }

}