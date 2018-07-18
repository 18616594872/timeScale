/**
 * Created by dhl on 2018/6/16.
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
        this.clickY=0;// 保留上次的Y轴位置
        this.preview=null;// 要处理的对象
        this.operateType=null;
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
                    <div class="showDate" id="showDate"><span></span></div>
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
            this.clickY = this._location.y;
            this.clickX = this._location.x;
            this.operateType = type;
            this.preview = $(".preview");
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
                    switch (_this.operateType){
                        case "w":
                            _this.move(_this.operateType,location,_this.preview);
                            break;
                        case "e":
                            _this.move(_this.operateType,location,_this.preview);
                            break;
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
                    if(location.x>=(this.pareWidth+this.pareOffsetX)){location.x=this.pareWidth+this.pareOffsetX}

                    let add_length = this.clickX - location.x;
                    this.clickX = location.x;
                    preview.css({
                        width:parseInt(preview.css('width'))-add_length+ "px"
                    });
                    break;
            }
        },
        _createEvent(){
            var _this=this;

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