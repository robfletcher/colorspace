$(function() {
	$.fn.extend({ 
	
		colorspace: function(options) {
			var defaults = {
			}
			var options = $.extend(defaults, options);
			
			return this.each(function() {
				var baseColor = $(this).find('.base-color input[name=basecolor]');
				var colorTransforms = $(this).find('.color-transforms');
				var transformPalette = $(this).find('.transform-palette');
				
				var toColor = function(hexColor) {
					return new less.tree.Color(hexColor.substring(1));
				}
				
				var toPercent = function(value) {
					return new less.tree.Dimension(value + '%');
				}

				// iterates over transforms and updates their color by applying their function to the output of the previous transform
				var updateColors = function() {
					var startColor = null;
					var endColor = toColor(baseColor.val());
					colorTransforms.find('li').each(function() {
						startColor = endColor;
						var transformFunction = less.tree.functions[$(this).data('transform')];
						var amount = toPercent($(this).find('input[name=amount]').val());
						endColor = transformFunction(startColor, amount);
						$(this).css('backgroundColor', endColor.toCSS()).data('end-color', endColor);
						$(this).find('.start-color').text(startColor.toCSS());
						$(this).find('.amount').text(amount.toCSS());
						$(this).find('output').text(endColor.toCSS());
					});
				};
				
				// initializes a new transform tool when it is added to the sortable
				var initializeTransform = function(event, ui) {
					var newItem = $(this).find('li:not(:has(code))');
					newItem.data('transform', ui.item.data('transform'));
					newItem.html('<code><span class="fn"></span>(<span class="start-color"></span>, <span class="amount"></span><span class="unit"></span>)</code>');
					newItem.find('.fn').text(ui.item.data('transform'));
					newItem.find('.unit').text(ui.item.data('unit'));
					newItem.append('<output></output>');
					newItem.append($('<input>', {
						type: 'range',
						name: 'amount',
						min: ui.item.data('min'),
						max: ui.item.data('max'),
						value: '10'
					}));
				};
				
				// if the base color changes update the background and trigger update on the first transform
				baseColor.change(function() {
					var color = $(this).val();
					$(this).closest('.base-color').css('backgroundColor', color);
					$(this).next('output').text(color);
					updateColors();
				});

				// when transforms are sorted update them all
				colorTransforms.sortable({
					receive: initializeTransform,
					update: updateColors
				});
				
				// when the amount changes in a transform update them all
				colorTransforms.delegate('input', 'change', updateColors);
				
				// initialize palette with a droppable for each transform function
				$.each(['lighten', 'darken', 'saturate', 'desaturate', 'fadein', 'fadeout'], function(i, fn) {
					var tool = $('<li/>', {
						text: fn
					}).data('transform', fn).data('unit', '%').data('min', 0).data('max', 100);
					transformPalette.append(tool);
				});
				var spinTool = $('<li>spin</li>').data('transform', 'spin').data('min', -180).data('max', 180);
				transformPalette.append(spinTool);
				
				transformPalette.find('li').draggable({
					connectToSortable: colorTransforms,
					helper: 'clone',
					revert: 'invalid'
				});
				
				baseColor.trigger('change');
			});	
		}
	
	});
	
	$('.colorspace').colorspace();
});
