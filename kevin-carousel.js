class KevinCarousel{
    
    constructor(carousels){
        this.carousels = document.querySelectorAll(carousels);
        this.draggable = true;
        this.gap = 10;
        this.items = 3;
    }

    init(options){
        this.initListener();
        this.setDraggable(options.draggable);
        this.carousels.forEach(carousel=>{
            const stageOuter = this.initStageOuter();
            this.initStage(carousel, stageOuter);
            this.setSizeItem(stageOuter);
        });
        this.stages.forEach(stage=>{
            this.initClassNames(stage);
            this.setGap(stage, options.gap);
            this.createClone(stage);
            this.initListenerStage(stage);
            this.initTranslate(stage);
        });
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
        const widthItem = width / this.items;
        stageOuter.querySelector('.kevin-stage').querySelectorAll('.item').forEach(item=>item.style.minWidth = widthItem + 'px');
    }

    initListener(){
        addEventListener('resize', ()=>{
            this.stagesOuter.forEach(this.setSizeItem.bind(this));
        })
    }

    initListenerStage(stage){
        stage.querySelectorAll('.kevin-item').forEach(item=>{
            item.addEventListener('dragstart', e=>e.preventDefault());
        })

        if(!this.draggable) return;
        stage.addEventListener('mousedown', function(){
            stage.style.cursor = 'grab';
        });
        stage.addEventListener('mouseout', function(){
            stage.style.cursor = 'default';
        });
        stage.addEventListener('mouseup', function(){
            stage.style.cursor = 'default';
        });
    }

}