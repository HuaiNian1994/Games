//贪吃蛇案例：蛇吃了食物，蛇变长且食物消失并于地图内再随机生成一个。食物不能在蛇体内生成。蛇碰到地图边界游戏终止。蛇碰到自己游戏终止。蛇占满地图游戏终止。
//对象的“属性” 和 “功能”归属：
//蛇：宽度、长度、坐标、颜色          吃、变长、运动
//食物：坐标、颜色、宽、高              生成、消失
//逻辑控制器：开始游戏、宣布游戏结束、控制蛇 吃、变长、运动  以及食物何时生成、消失的逻辑



$(function () {
    ////////////////////////////构造函数Food开始/////////////////////////////
    (function () { //划定局部作用域，避免变量名和方法名的冲突
        //食物的私有属性：坐标、颜色、宽、高
        //食物的公有属性：随机生成并设置食物坐标的函数render
        function Food() {
            //设定默认值
            //string型的属性
            this.color = 'yellow';
            //number型的属性，单位是px
            this.x = 0;
            this.y = 0;
            this.width = 25;
            this.height = 25;

        }
        //food的渲染：设置其坐标并在map中显示
        Food.prototype.render = function (jQmap, snake) {
            //计算坐标(先不考虑是否会在蛇体内)
            var that = this;

            function getIndex() {
                that.x = getRandomInt(0, jQmap[0].offsetWidth / that.width - 1) * that.width;
                that.y = getRandomInt(0, jQmap[0].offsetHeight / that.height - 1) * that.height;
                var FDX = that.x / that.width;
                var FDY = that.y / that.height;
                for (var i = snake.body.length - 1; i >= 0; i--) {
                    if (snake.body[i].x == FDX) {
                        if (snake.body[i].y == FDY) {

                            snake.enlarge();
                            console.log('体内生成！');
                            getIndex();

                        }
                    }
                }
            }
            getIndex();


            //创建节点并添加到地图中
            $('<div id="food"></div>').css({
                'width': this.width + 'px',
                'height': this.height + 'px',
                'position': 'absolute',
                'backgroundColor': this.color,
                'z-index': 1000,
                'left': this.x + 'px',
                'top': this.y + 'px'
            }).appendTo(jQmap);

        }
        window.Food = Food; //暴露构造函数
    })();


    /////////////////构造函数Food结束，构造函数Snake开始/////////////////////
    (function () { //划定局部作用域，避免变量名和方法名的污染

        //蛇的私有属性：宽度、长度、坐标、颜色 、方向         变长、运动
        function Snake() {
            //清除上一条蛇
            $('#snake').remove();

            //设定默认值



            //设定蛇的每一节,蛇每节的大小都一致,且与food同大,body[0]为蛇头,蛇的长度为3
            this.body = [{
                    'direction': 'right',
                    width: 25,
                    height: 25,
                    x: 3,
                    y: 0,
                    color: 'rgb(20,200,200)'
                },
                {
                    width: 25,
                    height: 25,
                    x: 2,
                    y: 0,
                    color: 'pink'
                },
                {
                    width: 25,
                    height: 25,
                    x: 1,
                    y: 0,
                    color: 'pink'
                },
                {
                    width: 25,
                    height: 25,
                    x: 0,
                    y: 0,
                    color: 'pink'
                }
            ];
        }
        Snake.prototype.render = function (jQmap) {
            var mph = $('#map')[0].clientHeight;
            var mpw = $('#map')[0].clientWidth;
            // 依据蛇对象的属性，把每个蛇节进行DOM渲染
            //设定包含所有蛇节的父节点,其与map大小相等，位置相同
            var allSnake = $('<div id=\'snake\'></div>').css({
                'position': 'relative',
                'width': mpw + 'px',
                'height': mph + 'px',
                'left': 0,
                'top': 0
            }).appendTo(jQmap);
            for (var i = 0, len = this.body.length; i < len; i++) {
                // 蛇节
                var object = this.body[i];

                //创建、设定蛇节并将其添加到jQmap中
                $('<div></div>').css({
                    'width': object.width + 'px',
                    'height': object.height + 'px',
                    'position': 'absolute',
                    'backgroundColor': object.color,
                    'z-index': 1000,
                    'left': object.x * object.width + 'px',
                    'top': object.y * object.height + 'px',
                    'border': '1px solid white'
                }).appendTo(allSnake);

            }
        }

        Snake.prototype.move = function () {
            //定时器在执行时，会指向window，所以要先保存this的地址
            var that = this;
            var head = that.body[0];

            //控制蛇身：依次遍历每个蛇节，从蛇尾开始遍历，将每个蛇节移动到上一节的位置
            for (var i = that.body.length - 1; i > 0; i--) {
                that.body[i].x = that.body[i - 1].x;
                that.body[i].y = that.body[i - 1].y;
            }
            //控制蛇头
            switch (head.direction) {
                case 'right':
                    head.x++;
                    break;
                case 'left':
                    head.x--;
                    break;
                case 'top':
                    head.y--;
                    break;
                case 'bottom':
                    head.y++;
                    break;
            }
            //删除当前蛇
            $('#snake').remove();
            //重新渲染
            that.render($('#map'));
            // console.log('head.x head.y : '+head.x+','+head.y);
            // console.log(that.body.length);


            //记录键盘按下时的方向
            //利用了内存销毁机制，当离开定时器后，onkeydown将被初始化
            window.onkeydown = function (e) {
                switch (e.keyCode) {
                    case 39:
                        console.log('right');
                        if (head.direction != 'left')
                            head.direction = 'right';
                        break;

                    case 37:
                        console.log('left');
                        if (head.direction != 'right')
                            head.direction = 'left';
                        break;

                    case 38:
                        console.log('top');
                        if (head.direction != 'bottom')
                            head.direction = 'top';
                        break;

                    case 40:
                        console.log('bottom');
                        if (head.direction != 'top')
                            head.direction = 'bottom';
                }
            }
        }


        Snake.prototype.enlarge = function () {
            //最后一节 蛇节
            var object = this.body[this.body.length - 1];
            var piceOfBody = {
                width: 25,
                height: 25,
                x: object.x,
                y: object.y,
                color: 'pink'
            };
            this.body.push(piceOfBody);
            console.log(this.body.length);
        };
        window.Snake = Snake;
        //snack 小吃


    })();
    /////////////////////Snake函数结束，Controller函数开始////////////////
    //逻辑控制器：开始游戏、宣布游戏结束、控制蛇 吃、变长、运动  以及食物何时生成、消失的逻辑
    (function () {
        function Controller() {
            var snake = new Snake(); //创建蛇
            snake.render($('#map'));

            var food = new Food(); //创建食物
            food.render($('#map'), snake);

            $(window).keydown(function (e) {
                if (e.keyCode == 69) {
                    snake.enlarge();

                }
            });


            // 让蛇运动并监视全局
            var timer = null;
            timer = setInterval(function () {
                snake.move(); //让蛇运动
                var x = snake.body[0].x;
                var y = snake.body[0].y;
                //边界判别
                var bdx = $('#map')[0].clientWidth / snake.body[0].width - 1;
                var bdy = $('#map')[0].clientHeight / snake.body[0].height - 1;
                if (x < 0 || x > bdx || y < 0 || y > bdy) {
                    $('#snake').remove();
                    $('#food').remove();
                    alert('you lose');
                    clearInterval(timer);
                }
                //吃自己判别
                for (var i = snake.body.length - 1; i > 0; i--) {
                    if (snake.body[0].x == snake.body[i].x) {
                        if (snake.body[0].y == snake.body[i].y) {
                            $('#snake').remove();
                            $('#food').remove();
                            alert('you lose');
                            clearInterval(timer);
                        }
                    }
                }
                //吃食物判别
                var FDX = food.x / food.width;
                var FDY = food.y / food.height;
                if (snake.body[0].x == FDX) {
                    if (snake.body[0].y == FDY) {
                        $('#food').remove();
                        food.render($('#map'), snake);
                        snake.enlarge();


                    }
                }
            }, 200);


        }
        window.Controller = Controller;
    })();

    //////////////////Controller构造函数结束，其他函数开始////////////////////

    (function () {
        //封装一个能返回某闭区间内随机整数的函数：
        function getRandomInt(min, max) {
            min = Math.ceil(min); // 向上取整
            max = Math.floor(max); // 向下取整
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        window.getRandomInt = getRandomInt;
    })();
    ////////////////////////////测试代码开始/////////////////////////////////


    //阶段一：创建一个地图、创建一个静态的食物、创建一条静态的蛇
    // var food=new Food();
    // food.render($('#map'),snake);
    // var snake=new Snake();
    // snake.render($('#map'));
    // console.dir(snake);

    //阶段二：实现食物、蛇的移除
    // $('#snake').remove();
    // $('#food').remove();

    //阶段三:实现蛇的运动、变长
    // snake.move();
    // $(window).keydown(function(e){
    // 	if(e.keyCode==69)snake.enlarge();
    // });


    //阶段四：实现逻辑控制器，控制游戏全局
    Controller();


});
