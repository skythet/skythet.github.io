---
title: BackboneJS-пен жаттығу - автобустар уақытын бақылау
tags: javascript, backbonejs
category: javascript
image: backbone-amub.png
published: true
---

Өткен жолы <ls user="domalak" /> <a href="http://codeo.kz/blog/JavaScript/272.html">AngularJS-пен бейнежаттығуын</a> жариялап еді. Бағдарлама өте қарапайым және AngularJS негізгі мүмкіндіктерін көруге мүмкіндік береді. Ал мен бұл жолы дәл сол бағдарламаны <a href="http://backbonejs.org/">BackboneJS</a> фреймворкы арқылы жасап көрдім. Мұндағы мақсат кім мықты деу немесе фреймворктарды салыстыру емес, жай екі фреймворкта мәселенің қалай шешілетінін қарастыру. Бағдарламаның дайын нұсқасын <a href="http://sythet.github.io/amub/">мына жерден</a> қарауға болады.

BackboneJS ол өте қарапайым фреймворк, ол сіздің қолыңызға ең минималды мүмкіндіктерді береді, және сіз оған қоса Jquery және басқа да кітапханаларды пайдалана отырып мәселені шеше аласыз. Ондағы негізгі түсініктер ол Events, Model, Collection, View және сонымен бірге Router.

<a href="http://backbonejs.org/#Events"><strong>Events</strong></a> - белгілі бір объектінің өзгерістеріне немесе әрекеттеріне жазылуға мүмкіндік береді. Мысалыға, біз модель өзгерген сайын оның көрсетілімін қайта сала аламыз.

<a href="http://backbonejs.org/#Model"><strong>Model</strong></a> - мәліметтер сақтайтын объектілеріміз.

<a href="http://backbonejs.org/#Collection"><strong>Collection</strong></a> - модель бойынша объектілер жиынтығы, тізімі.

<a href="http://backbonejs.org/#Router"><strong>Router</strong></a> - белгілі бір әрекеттерді URL-ге байланыстыруға мүмкіндік береді және пайдаланушы браузер тарихымен оңай жұмыс жасай алады (браузердегі алға артқа функциялары дұрыс жұмыс жасайды). Бірақ бұл бағдарламада біз бұл мүмкіндікті пайдаланбаймыз.

Бағдарламаны жазуды бастайық. Бастапқыда бағдарлама AngularJS қосылғаннан бұрын мына түрде еді:
<spoiler title="Бастапқы код.">
<code>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>АМУБ</title>
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
</head>
<body>
    <h3 class="text-center">Автобус маршруттарының уақытын бақылағыш</h3>
    <hr>
    <div class="col-sm-offset-3 col-sm-6 form-inline">
        <label>Маршрут, жүргізуші</label>
        <input class="form-control" type="text">
        <button class="btn btn-primary">Тізімге қосу</button>
    </div>
    <div class="clearfix"></div>
    <hr>

    <table class="table">
        <tr>
            <th>Маршрут, жүргізуші</th>
            <th>Келген уақыты</th>
            <th>Кеткеніне қанша уақыт</th>
            <th>Әрекеттер</th>
        </tr>
    </table>
</body>
</html>
</code>
</spoiler>
Біз ангулар орнына backbone-ға қажет javascript файлдарды қосамыз, backbone өзі <a href="https://jquery.com/">jquery</a> және <a href="http://underscorejs.org/">underscore</a> кітапханаларынан тәуелді, сондықтан оларды да қосу керек:
<code>
<script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.16/backbone.localStorage-min.js"></script>
</code>

<em>backbone.localStorage-min.js</em> кейін бізге мәліметтерді арнайы қоймада сақтауға мүмкіндік береді. Ол мүмкіндік html5-те пайда болды.

Бағдарламамыздың негізгі js коды сақталатын app.js файлын құрып, оны да қосу қажет. <spoiler title="Оның ішінде мынандай код жазамыз.">
<code>var app = app || {}; // егер объектілеріміз сыртта керек болып қалса қажет болады

(function($) {
    
    // барлық кодтарды мұнда жазамыз

})(jQuery);</code>
</spoiler>

Мәліметтер сақтайтын Collection мен әр автобусты көрсететін model керек. Алдымен Bus моделін құрамыз:
<code>
var Bus = Backbone.Model.extend({
    defaults: {
        timerStarted: false,
        timer: ""
    },
    refresh: function() {
        this.set({
            timerStarted: false,
            departureTime: null,
            timer: null,
            arrivalTime: new Date() 
        });
    }
});
</code>

Мұнда refresh функциясы автобус қайтып келгенде орындалатын функция. Енді бізге осы модельдің негізіндегі Collection керек, яғни, онда автобустардың тізімі сақталатын болады.
<code>
var Buses = Backbone.Collection.extend({
    model: Bus,
    localStorage: new Backbone.LocalStorage('amub-buses')
});
</code>

<em>localStorage</em> мәліметтерді арнайы қоймада сақтап, бет жаңарғанда да мәліметтерді жоғалтпауға мүмкіндік береді. Олардың құрамын хром браузерінде былай қарауға болады:
<img src="http://codeo.kz/uploads/images/00/00/15/2015/04/07/e97b32.png"  class="image-center" alt="" />

Енді бізге мәліметті ендіріп батырманы басқан кезде, автобусты тізімге қосу керек. Одан алдын, сол автобустарды көрсететін шаблондарды дайындап алайық. Біз underscore қарапайым шаблондарын пайдаланамыз. Мысалы, автобустар тізімін шығаратын шаблон мына түрде болады:
<code>
<script type="text/template" id='buses-template'>
    <% if (buses.length == 0) {%> <!-- егер тізім бос болса -->
        <p class="text-center text-muted">Бірде-бір автобус енгізілмеген</p>
    <% } else {%>
        <table class="table">
            <tr>
                <th>Маршрут, жүргізуші</th>
                <th>Келген уақыты</th>
                <th>Кеткеніне қанша уақыт</th>
                <th>Әрекеттер</th>
            </tr>
        </table>
    <% }%>
</script>
</code>

Ал әр автобус үшін мынандай шаблон пайдаланамыз:
<code>
<script type="text/template" id='bus-template'>
    <td><%= name %></td>
    <td><% 
        var date = new Date(arrivalTime);
        print(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()); 
    %>
    </td>
    <td><% if (timer) {print(new Date(timer).getMinutes() + ":" + new Date(timer).getSeconds());} %></td>
    <td>
        <button <% if (timerStarted) print('disabled'); %> class="btn btn-success btn-xs start-timer" title="Кеткен уақытты сана"><i class="glyphicon glyphicon-play"></i></button>
        <button class="btn btn-warning btn-xs refresh-bus" title="Келген уақытын жаңарт"><i class="glyphicon glyphicon-repeat"></i></button>
        <button class="btn btn-danger btn-xs remove-bus" title="Тізімнен алып таста"><i class="glyphicon glyphicon-remove"></i></button>
    </td>
</script>
</code>

Және view тіркеле алатын <code><div id="content"></div></code> элементін қосамыз, сонымен бірге басқару панелін де view-пен байланыстыру үшін оған control-panel деген id береміз. <spoiler title="Сонымен біздің html құжатымыз мына түрге келеді.">
<code><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>АМУБ</title>
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.16/backbone.localStorage-min.js"></script>
</head>
<body>
    <h3 class="text-center">Автобус маршруттарының уақытын бақылағыш</h3>
    <hr>
    <div class="col-sm-offset-3 col-sm-6 form-inline" id='control-panel'>
        <label>Маршрут, жүргізуші</label>
        <input class="form-control" type="text">
        <button class="btn btn-primary">Тізімге қосу</button>
    </div>
    <div class="clearfix"></div>
    <hr>

    <div id="content"></div>

    <script type="text/template" id='bus-template'>
        <td><%= name %></td>
        <td><% 
            var date = new Date(arrivalTime);
            print(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()); 
        %>
        </td>
        <td><% if (timer) {print(new Date(timer).getMinutes() + ":" + new Date(timer).getSeconds());} %></td>
        <td>
            <button <% if (timerStarted) print('disabled'); %> class="btn btn-success btn-xs start-timer" title="Кеткен уақытты сана"><i class="glyphicon glyphicon-play"></i></button>
            <button class="btn btn-warning btn-xs refresh-bus" title="Келген уақытын жаңарт"><i class="glyphicon glyphicon-repeat"></i></button>
            <button class="btn btn-danger btn-xs remove-bus" title="Тізімнен алып таста"><i class="glyphicon glyphicon-remove"></i></button>
        </td>
    </script>

    <script type="text/template" id='buses-template'>
        <% if (buses.length == 0) {%>
            <p class="text-center text-muted">Бірде-бір автобус енгізілмеген</p>
        <% } else {%>
            <table class="table">
                <tr>
                    <th>Маршрут, жүргізуші</th>
                    <th>Келген уақыты</th>
                    <th>Кеткеніне қанша уақыт</th>
                    <th>Әрекеттер</th>
                </tr>
            </table>
        <% }%>
    </script>
    <script src="app.js"></script>
</body>
</html></code>
</spoiler>

Енді автобус атын енгізіп, батырманы басқан кезде автобус ендіретін view жаза аламыз:
<code>
var ControlPanelView = Backbone.View.extend({
    el: '#control-panel',

    events: {
        'click .btn-primary': 'addBus'
    },

    addBus: function() {
        var that = this;
        app.buses.create({
            name: that.$('input').val(),
            arrivalTime: Date.now()
        });
        that.$('input').val('');
    }
})
</code>

Осы автобус қосылған сайын біз тізімді қайта шығаруымыз керек, ол үшін тізімнің көрсетілімін былай жазамыз:
<code>
var BusesView = Backbone.View.extend({
    el: '#content',

    template: _.template($('#buses-template').html()), // алдын дайындалып қойған шаблонымызды қолданамыз

    initialize: function() {
        // коллекцияның әр өзгеруінде тізімді қайта шығарамыз
        this.listenTo(app.buses, 'add', this.render);
        this.listenTo(app.buses, 'remove', this.render);
        this.listenTo(app.buses, 'fetch', this.render);
    },

    render: function() {
        var that = this;
        that.$el.html(this.template({buses: app.buses}));
        app.buses.each(function(bus) { // әр автобустарды салып шығамыз
            that.$('table').append(
                new BusView({model: bus}).render().el
            );
        });
    }
});
</code>

Әр автобусқа арналған view-іміз: (негізгі логика осы жерде)
<code>
var BusView = Backbone.View.extend({
    tagName: 'tr',

    template: _.template($('#bus-template').html()),

    events: {
        'click .start-timer': 'startTimer', // play батырмасын басқанда
        'click .refresh-bus': 'refreshBus', // reset батырмасын басқанда
        'click .remove-bus': 'removeBus' // жою батырмасын басқанда
    },

    initialize: function() {
        this.listenTo(this.model, 'change', this.render); // модель әр өзгерген сайын қайта саламыз
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    startTimer: function() {
        this.model.set({
            timerStarted: true,
            departureTime: Date.now(),
            timer: 0
        });
        this.model.save(); // localStorage ға сақтау үшін
    },

    refreshBus: function() {
        this.model.refresh();
        this.model.save();

        // автобусты тізім басына шығарамыз
        app.buses.remove(this.model);
        app.buses.add(this.model, {at: 0, trigger: true});
    },

    removeBus: function() {
        this.model.destroy(); // жою, тізім автоматты түрде қайта салынады
    }
});
</code>

<spoiler title="Сондағы біздің app.js файлдымыздың толық нұсқасы.">
<code>
var app = app || {};

(function($) {

    var Bus = Backbone.Model.extend({
        defaults: {
            timerStarted: false,
            timer: ""
        },
        refresh: function() {
            this.set({
                timerStarted: false,
                departureTime: null,
                timer: null,
                arrivalTime: new Date() 
            });
        }
    });

    var Buses = Backbone.Collection.extend({
        model: Bus,
        localStorage: new Backbone.LocalStorage('amub-buses')
    }); 

    var BusView = Backbone.View.extend({
        tagName: 'tr',

        template: _.template($('#bus-template').html()),

        events: {
            'click .start-timer': 'startTimer',
            'click .refresh-bus': 'refreshBus',
            'click .remove-bus': 'removeBus'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        startTimer: function() {
            this.model.set({
                timerStarted: true,
                departureTime: Date.now(),
                timer: 0
            });
            this.model.save();
        },

        refreshBus: function() {
            this.model.refresh();
            this.model.save();
            app.buses.remove(this.model);
            app.buses.add(this.model, {at: 0, trigger: true});
        },

        removeBus: function() {
            this.model.destroy();
        }
    });

    var BusesView = Backbone.View.extend({
        el: '#content',

        template: _.template($('#buses-template').html()),

        initialize: function() {
            this.listenTo(app.buses, 'add', this.render);
            this.listenTo(app.buses, 'remove', this.render);
            this.listenTo(app.buses, 'fetch', this.render);
        },

        render: function() {
            var that = this;
            that.$el.html(this.template({buses: app.buses}));
            app.buses.each(function(bus) {
                that.$('table').append(
                    new BusView({model: bus}).render().el
                );
            });
        }
    });

    var ControlPanelView = Backbone.View.extend({
        el: '#control-panel',

        events: {
            'click .btn-primary': 'addBus'
        },

        addBus: function() {
            var that = this;
            app.buses.create({
                name: that.$('input').val(),
                arrivalTime: Date.now()
            });
            that.$('input').val('');
        }
    })

    app.buses = new Buses(); // collection
    new ControlPanelView();
    new BusesView().render();
    app.buses.fetch();

    setInterval(function() {
        app.buses.each(function(bus) {
            if (bus.get('timerStarted')) {
                bus.set('timer', Date.now() - bus.get('departureTime'));
                bus.save();
            }
        });
    }, 1000);

})(jQuery);
</code>
</spoiler>

Толық кодты <a href="https://github.com/sythet/amub">github-тан</a> қарай аласыздар.

Осы жерге дейін оқып келген болсаңыз, жоғарыда айтқанымдай жұмыс істеп тұрған бағдарламаны <a href="http://sythet.github.io/amub/">мына жерден</a> қарай аласыз.
