/**
 * 时间刻度插件
 */
;
(function($, window, document,undefined){
    'use strict';

    var pluginName = "timeScale",
        defaults = {
            width: '570px',
            background:'linear-gradient(to right,#434d5a 0,#00c7d7 50%,#434d5a 100%)'
        };
    function TimeScale(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this._location=null;
        this.clickX=0;//保留上次的X轴位置
        this.preview=null;// 要处理的对象
        this.operateType=null;// w:表示向左拉，e:表示向有拉
        this.btnWidth=3 //按钮宽度
        this.LeftTime='00:00' //保留上次左边时间
        this.RightTime='00:00' //保留上次由边时间
        this.pareOffsetX=0;//距离左边的偏移度
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
                <div id="timeScale" class="timeScale" style="position: relative;height: 27px">
                    <div class="preview" style="width:200px;height:19px; position:absolute; left:200px; top:7px;" >
                        <div class="leftBtn" id="leftBtn" ></div>
                        <div class="rightBtn" id="rightBtn"></div>
                    </div>
                    <div class="showTime" id="showTime"><span></span></div>
                </div>
                `;
            $(_this.element).append(scaleHtml)

            $('.timeScale').css({
                width: _this.settings.width,
            })
                .children(".preview").css({
                'background':_this.settings.background
            })

        },
        getLocation(e) {
            return {
                x: e.x || e.clientX,
                y: e.y || e.clientY
            }
        },
        getScaleStyle(prop){
            let propStyle = prop != undefined ?this.preview.parent().css(prop):this.preview.parent().offset().left;
            return propStyle;
        },
        dragDown(e, type){
             e=e || window.event;

            this._location = this.getLocation(e);
            this.clickX = this._location.x;
            this.operateType = type;
            this.preview = $(".preview");
            this.showTime=$('.showTime');
            this.pareOffsetX=this.getScaleStyle();
            this.pareWidth=parseFloat(this.getScaleStyle('width'));

            return false;

        },
        dragMove(){
            let _this=this; 

            return function(e){
                if(_this.operateType){
                    e =e || window.event;
                    let location=_this.getLocation(e);
                    if (_this.operateType){
                        let operateType= _this.operateType == 'w'? _this.operateType :'e'

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
            switch (operateType){
                case 'w':
                    _this.LeftTime=Hour + ":" + Minute;
                    break;
                case 'e':
                    _this.RightTime=Hour + ":" + Minute;
                    break;
            }
            this.showTime.children('span').html(_this.LeftTime + "-"+_this.RightTime);
        },
        _createEvent(){
            let _this=this;

            $("#leftBtn").mousedown(e=>_this.dragDown(e, "w"));
            $("#rightBtn").mousedown(e=>_this.dragDown(e, "e"));

            $(document).mousemove(_this.dragMove.call(_this));
            $(document).mouseup(_this.dragUp.call(_this));
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