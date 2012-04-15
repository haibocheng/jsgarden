// make some alias
M = Backbone.Model;
V = Backbone.View;
CM = Backbone.Collection;

$( function() {
	// 创建一个Model,其拥有如下属性
	// title: todo text
	// order: 排列顺序
	// done: 是否完成
	var Todo = Backbone.Model.extend({
		defaults: function() {
			return {
				title: '尚未输入内容...',
				order: Todos.nextOrder(),
				done: false
			};
		},
		// 初始化方法，确保设置了title
		initialize: function() {
			if (!this.get("title")) {
				var title = this.defaults.title;
				this.set({"title": title});
			}
		},
		// 改变Todo的完成状态
		toggle: function() {
			// save时，会出发sync事件，Backbone.sync会请求后台进行持久化操作。
			// read more: http://www.csser.com/tools/backbone/backbone.js.html#manual/Model-save
			this.save({done: !this.get("done")});
		},
		clear: function() {
			this.destroy();
		}
	});

	// 创建TodoList, Backbone.Collection
	// Bacbone.Collection的操作，大部分由Underscore.js提供
	// readmore: http://documentcloud.github.com/underscore/
	var TodoList = CM.extend({
		model: Todo,
		// Save all of the todo items under the `"todos"` namespace.
		localStorage: new Store("todos-backbone"),

		// 一个过滤器，查找done=true的Todo
		done: function() {
			return this.filter( function(todo) {
				return todo.get('done');
			});
		},
		// remaining, 过滤尚未完成的任务
		remaining: function() {
			// 从collection中过滤掉,done中过滤的内容
			// _.without([1,2,3,4,5], 2, 3) => [1,4,5].
			return this.without.apply(this, this.done());
		},
		// 用来生成order,作用有点类似database中的id generator
		nextOrder: function() {
			if(!this.length)
				return 1;
			return this.last().get('order') + 1;
		},
		// 实现comparetor, 对order字段进行比较
		comparetor: function(todo) {
			return todo.get('order');
		}
	});

	var Todos = new TodoList;

	// Todo List View
	var TodoView = V.extend({
		tagName: 'li',
		template: _.template($('#item-template').html()),
		/*
		 <div class="view">
		 <input class="toggle" type="checkbox" <%= done ? 'checked="checked"' : '' %> />
		 <label><%= title %></label>
		 <a class="destroy"></a>
		 </div>
		 <input class="edit" type="text" value="<%= title %>" />
		 */
		events: {
			"click .toggle": "toggleDone", // 当checbox.toggle被click时, 调用this.toggleDone方法
			"dblclick .view": "edit", //双击div.view时,出发edit方法, 并且切换到编辑模式
			"click a.destroy": "clear",
			"keypress .edit": "updateOnEntor", //监听键盘时间,如果用户按下"Enter"键则完成输入
			"blur .edit": "close", // :text.edit 失去焦点,关闭编辑模式
		},

		// 绑定model的change,destory事件
		// change: render
		// destory: remove
		initialize: function() {
			// on:  bind 方法的别名,
			// off: unbind 方法的别名
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},
		render: function() {
			// $el: 是View中,对$(this)对象的缓存
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('done', this.model.get('done'));
			this.input = this.$('.edit');
			return this;
		},
		toggleDone: function() {
			this.model.toggle();
		},
		edit: function() {
			// 给当前的li添加editing css class
			this.$el.addClass('editing');
			this.input.focus();
		},
		close: function() {
			var val = this.input.val();
			if(!val)
				this.clear();
			this.model.save({
				title: val
			});
			this.$el.removeClass('editing');
		},
		updateOnEntor: function(e) {
			if (e.keyCode == 13)
				this.close();
		},
		clear: function() {
			this.model.clear();
		}
	});

	// AppView
	var AppView = V.extend({
		el: $('#todoapp'),

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),
		events: {
			"keypress #new-todo":  "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},

		initialize: function() {
			this.input = this.$("#new-todo");
			this.allCheckbox = this.$("#toggle-all")[0];

			Todos.bind('add', this.addOne, this);
			Todos.bind('reset', this.addAll, this);
			Todos.bind('all', this.render, this);

			this.footer = this.$('footer');
			this.main = $('#main');

			Todos.fetch();
		},
		render: function() {
			var done = Todos.done().length;
			var remaining = Todos.remaining().length;

			if (Todos.length) {
				this.main.show();
				this.footer.show();
				this.footer.html(this.statsTemplate({
					done: done,
					remaining: remaining
				}));
			} else {
				this.main.hide();
				this.footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},
		createOnEnter: function(e) {
			if (e.keyCode != 13)
				return;
			if (!this.input.val())
				return;

			Todos.create({
				title: this.input.val()
			});
			this.input.val('');
		},
		clearCompleted: function() {
			_.each(Todos.done(), function(todo){ todo.clear(); });
      		return false;
		},
		toggleAllComplete: function() {
			var done = this.allCheckbox.checked;
			Todos.each( function (todo) {
				todo.save({
					'done': done
				});
			});
		},
		addOne: function(todo) {
			var view = new TodoView({
				model: todo
			});
			this.$('#todo-list').append(view.render().el);
		},
		addAll: function() {
			Todos.each(this.addOne);
		}
	});

	var App = new AppView;
});