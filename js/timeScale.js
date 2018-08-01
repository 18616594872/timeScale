/**
 * Time scale plugin
 */
;
(function($, window, document,undefined){
    'use strict';

    var pluginName = "timeScale",
        defaults = {
            width: '570px', //time scale width
            height:'27px', //time scale height
            background:'linear-gradient(to right,#434d5a 0,#00c7d7 50%,#434d5a 100%)',//progress background color
            showTimeTop:'31px',//time frame distance time scale height
            showTimeBgColor:'#fff',//time frame background color
            defaultTime:'09:00-18:00' //defaultTime
        };
    function TimeScale(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this._location=null;
        this.clickX=0;//keep the last X-axis position
        this.preview=null;// the object to be processed
        this.operateType=null;// w:表示向左拉，e:表示向有拉
        this.btnWidth=3 //button width
        this.LeftTime='00:00' //keep last time left
        this.RightTime='00:00' //keep last time right
        this.pareOffsetX=0;//offset from the left
        this.init();
    }
    TimeScale.prototype={
        init(){
            this._createHtml();
            this._createEvent();
        },
        _createHtml(){
            var _this=this,
                scaleHtml=`
                <div class="timeScale" style="position: relative;height: 27px">
                    <div class="timeScaleTop" ></div>
                    <div class="timeScalebody" >
                        <div class="preview" style="height:100%; position:absolute;" >
                                <div class="leftBtn" id="leftBtn" ></div>
                                <div class="rightBtn" id="rightBtn"></div>
                        </div>
                        <div class="showTime"><span></span></div>
                    </div>
                </div>
                `;
            $(_this.element).append(scaleHtml)

            $('.timeScale').css({
                width: _this.settings.width,
                height:_this.settings.height
            })
                .find(".preview").css({
                    'background':_this.settings.background
            })
                .next().css({
                top:_this.settings.showTimeTop,
                background:_this.settings.showTimeBgColor
            })

        },
        getLocation(e) {
            return {
                x: e.x || e.clientX,
                y: e.y || e.clientY
            }
        },
        getScaleStyle(prop){
            return prop != undefined ?this.preview.parent().css(prop):this.preview.parent().offset().left;
        },
        dragDown(e, type){
             e=e || window.event;

            this._location = this.getLocation(e);
            this.clickX = this._location.x;
            this.operateType = type;
            this.pareOffsetX=this.getScaleStyle();

            return false;

        },
        dragMove(){
            let _this=this; 

            return function(e){
                if(_this.operateType){
                    e =e || window.event;
                    let location=_this.getLocation(e);
                    if (_this.operateType){
                        let operateType= _this.operateType == 'w' ? _this.operateType :'e'
                        _this.move(operateType,location,_this.preview);
                    }
                }
            }

        },
        dragUp(){
            let _this=this;

            return function(){
                document.body.style.cursor = "auto";
                _this.operateType=null;
            }
        },
        move(operateType,location,preview){
            document.body.style.cursor = location + "_resize";

            switch (operateType){
                case "w":
                    let previewLeft = parseFloat(preview.css('left'));
                    if(this.clickX != (previewLeft+this.pareOffsetX))  { this.clickX = (previewLeft+this.pareOffsetX);break;}
                    if(location.x<=this.pareOffsetX){location.x=this.pareOffsetX}

                    let reduce_length = this.clickX - location.x;
                    this.clickX = location.x;
                    preview.css({
                        width:(parseInt(preview.css('width'))+reduce_length)+ "px",
                        left:(this.clickX-this.pareOffsetX)+ "px"
                    });
                    break;
                case "e":
                    if(location.x>=(this.pareWidth+this.pareOffsetX)){location.x=this.pareWidth+this.pareOffsetX;break;}
                    let add_length = this.clickX - location.x;
                    this.clickX = location.x;
                    preview.css({
                        width:parseInt(preview.css('width'))-add_length+ "px"
                    });
                    break;
            }
            this.showTime.css({display:'block',left:((this.clickX-this.pareOffsetX)-(parseFloat(this.showTime.css('width'))/2))+'px'})
            this.transformTime(operateType, this.clickX - this.pareOffsetX, this.pareWidth);
        },
        transformTime(operateType,pareOffsetX,pareWidth){
            let _this=this;
            //所有的秒
            let allTime = (pareOffsetX / pareWidth) * 24 * 3600;
            //当前所有的分钟
            let allMinute = allTime / 60;
            let Hour = (Math.floor(allMinute / 60).toString()).length != 2 ? "0" + Math.floor(allMinute / 60) : Math.floor(allMinute / 60);
            let Minute = (Math.floor(allMinute % 60).toString()).length != 2 ? "0" + Math.floor(allMinute % 60) : Math.floor(allMinute % 60);
            let transfromM=_this.transformInteger(Minute)

            transfromM = transfromM.toString().length != 2 ? "0" + transfromM : transfromM;
            if (transfromM.toString().indexOf(6) != -1) {
                Hour=(Number(Hour) + 1).toString().length != 2 ? "0" + (Number(Hour) + 1) : (Number(Hour) + 1);
                transfromM = "00";
            }
            switch (operateType){
                case 'w':
                    _this.LeftTime=Hour + ":" + transfromM;
                    break;
                case 'e':
                    _this.RightTime=Hour + ":" + transfromM;
                    break;
            }
            this.showTime.children('span').html(_this.LeftTime + "-"+_this.RightTime);
        },
        transformInteger(minute){
            return (parseInt(minute/10)*10)+(parseInt(minute%10/4))*5;
        },
        transformScale(){
            this.preview = $(".preview"), this.showTime=$('.showTime'),
            this.pareWidth=parseFloat(this.getScaleStyle('width'));

            this.settings.defaultTime.replace(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/,(prop,key,val)=>{this.LeftTime=key;this.RightTime=val;});
            let leftOffset = this.getOffset(this.LeftTime);
            let rightOffset = this.getOffset(this.RightTime);

            this.preview.css({ left: parseInt(leftOffset), width: parseInt((rightOffset - leftOffset)) });
        },
        getOffset(time){
            return time.replace(/^(\d{2}):(\d{2})$/,(str,key,val)=>(((key * 60 * 60) + (val * 60)) / (24 * 3600)) * this.pareWidth);
        },
        _createEvent(){
            let _this=this;

            $("#leftBtn").mousedown(e=>_this.dragDown(e, "w"));
            $("#rightBtn").mousedown(e=>_this.dragDown(e, "e"));

            $(document).mousemove(_this.dragMove.call(_this));
            $(document).mouseup(_this.dragUp.call(_this));

            this.transformScale();

        }

    }

    $.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new TimeScale(this, options));
            }
        });

        return this;
    };
})(jQuery, window, document);