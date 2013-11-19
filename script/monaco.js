
/******************************************************************************/

(function($)
{	
	/**************************************************************************/

	var Monaco=function(options,page,backgroundImage)
	{
		/**********************************************************************/

		var $this=this;

		var defaults=
		{
			googleMap			:
			{
				coordinates		:	[]
			}
		};

		$this.options=$.extend(defaults,options);

		$this.page=page;
		$this.backgroundImage=backgroundImage;

		$this.enable=false;

		$this.currentId=-1;

		$this.currentHash='';
		$this.previousHash='';

		$this.scrollbar='';

		$this.pageList=$('ul.page-list');
		$this.pageListItem=this.pageList.children('li.page-list-item');

		$this.menu=$('ul.header-menu li a');

		$this.pageHeight=parseInt(this.pageList.find('li:first').css('height'));

		/**********************************************************************/

		this.load=function()
		{		
			$this.createSupersizedSlider();

			$this.createPagePrealoder({onComplete:function()
			{	
				$('.page-preloader:first').fadeOut(300,function() 
				{
					$('.page-prealoder-wrapper:first').animate({height:0},500,'easeOutExpo',function() 
					{
						$(this).remove();						
						$('.main').css('display','block');

						$this.createNivoSlider();
						$this.createGoogleMap();
						$this.createPortfolio();

						$this.enable=true;

						if(window.location.hash=='') window.location.href='#!';
						$this.currentHash=window.location.hash;					

						$(window).bind('hashchange',function(event) 
						{
							event.preventDefault();

							if($this.isEnable()==false) return;

							$this.currentHash=window.location.hash;
							$this.doHash();
							$this.previousHash=$this.currentHash;
						}); 

						if($this.currentHash!=$this.previousHash) $this.doHash();
					});
				});
			}});
		};

		/**********************************************************************/

		this.getFirstPageId=function()
		{
			for(var id in $this.page) return(id);
		};

		/**********************************************************************/

		this.getPageId=function(hash)
		{
			var position=hash.lastIndexOf('#!');
			if(position!=0) return(false);

			var id=hash.substring(2);
			if(typeof($this.page[id])=='undefined') return(false);

			return(id);
		};

		/**********************************************************************/

		this.getPrevPageId=function()
		{
			var prev='';
			for(var id in $this.page)
			{
				if(id==$this.currentId && prev!='') return(prev);
				else prev=id;
			}

			return(prev);
		};

		/**********************************************************************/

		this.getNextPageId=function()
		{
			var n=false;
			var next=$this.getFirstPageId();

			for(var id in $this.page)
			{
				if(n) return(id);
				if(id==$this.currentId) n=id;
			}

			return(next);
		};

		/**********************************************************************/

		this.setNavigation=function()
		{
			var prev=$this.getPrevPageId();				
			var next=$this.getNextPageId();	

			$('.navigation-prev').attr('href','#!'+prev);
			$('.navigation-next').attr('href','#!'+next);
		};

		/**********************************************************************/

		this.doHash=function()
		{
			if(!$this.enable) return;
			$this.enable=false;

			var open=$this.isOpen();

			$this.currentId=$this.getPageId($this.currentHash);
			if($this.currentId==false)
			{
				$this.enable=true;
				window.location.href='#!'+$this.getFirstPageId();
				return;
			}

			if(open) $this.close({'onComplete':function() { $this.open(); }})
			else $this.open();
		};

		/**********************************************************************/

		this.isOpen=function()
		{		
			return(this.currentId==-1 ? false : true);
		};

		/**********************************************************************/

		this.open=function()
		{
			$this.selectMenu(true);

			$this.pageList.animate({height:$this.pageHeight},500,'easeOutExpo',function()	
			{											
				$this.createScrollbar();

				$('#'+$this.currentId).css('display','block');
				$this.setNavigation();

				api.goTo($this.page[$this.currentId].imageIndex);		

				if($('#gmap').length==1)
				{
					google.maps.event.trigger(map,'resize');
					map.setZoom(map.getZoom());
				}

				$this.previousHas=$this.currentHash;
				$this.enable=true;	
			});			
		};

		/**********************************************************************/

		this.close=function(data)
		{
			$this.selectMenu(false);

			$this.destroyQtip();

			$this.pageListItem.css('display','none');

			$this.destroyScrollbar();

			$this.pageList.animate({height:'0px'},500,'easeOutExpo',function()
			{				
				if(typeof(data)!='undefined')		
				{
					if(typeof(data.onComplete)!='undefined') data.onComplete.apply();
				}					
			});
		};

		/**********************************************************************/

		this.selectMenu=function(select)
		{
			if(select)
			{
				$this.selectMenu(false);
				$this.menu.eq($this.page[$this.currentId].menuIndex).addClass('selected');
			}
			else $this.menu.removeClass('selected');
		};

		/**********************************************************************/

		this.createScrollbar=function()
		{
			$this.scrollbar=$('#'+$this.currentId).jScrollPane({maintainPosition:false,autoReinitialise:true}).data('jsp');
		};

		/**********************************************************************/

		this.destroyScrollbar=function()
		{
			if($this.scrollbar!='')
			{
				$this.scrollbar.destroy();
				$this.scrollbar='';						
			}
		};

		/**********************************************************************/

		this.destroyQtip=function()
		{
			$(':input,a').qtip('destroy');
		};	

		/**********************************************************************/

		this.createGoogleMap=function()
		{
			if($('#gmap').length!=1) return;

			var coordinate=new google.maps.LatLng($this.options.googleMap.coordinates[0],$this.options.googleMap.coordinates[1]);
			var mapOptions= 
			{
				zoom		:	10,
				center		:	coordinate,
				mapTypeId	:	google.maps.MapTypeId.ROADMAP
			};

			map=new google.maps.Map(document.getElementById('gmap'),mapOptions);
		};

		/**********************************************************************/

		this.createSupersizedSlider=function()
		{
			$.supersized(
			{
				autoplay		:	0,
				keyboard_nav	:	false,
				slides			:	$this.backgroundImage
			});					
		};

		/**********************************************************************/

		this.createNivoSlider=function()
		{
			$('#slider').nivoSlider({directionNav:false,manualAdvance:true});
		};

		/**********************************************************************/

		this.createPortfolio=function()
		{
			$('.fancybox-image').fancybox(
			{
				titlePosition				:	'inside',
				onStart						:	function(links,index)
				{
					this.title=jQuery(links[index]).next('.fancybox-title').html();
				}
			});

			$('.fancybox-video-youtube').bind('click',function() 
			{
				$.fancybox(
				{
					padding					:	0,
					autoScale				:	false,
					transitionIn			:	'none',
					transitionOut			:	'none',
					width					:	860,
					height					:	468,
					href					:	this.href,
					type					:	'iframe'
				});

				return false;
			});

			$('.fancybox-video-vimeo').bind('click',function() 
			{
				$.fancybox(
				{
					padding					:	0,
					autoScale				:	false,
					transitionIn			:	'none',
					transitionOut			:	'none',
					width					:	860,
					height					:	468,
					href					:	this.href,
					type					:	'iframe'
				});

				return false;
			});

			$('.portfolio-list').hover(
				function() {},
				function()
				{
					$(this).find('li img').animate({opacity:1},250);
				}	
			);

			$('.portfolio-list li').hover(
				function() 
				{
					$(this).siblings('li').find('img').css('opacity',0.5);
					$(this).find('img').animate({opacity:1},250);
				},
				function()
				{
					$(this).find('img').css('opacity',1);	
				}
			);
		};

		/**********************************************************************/

		this.createPagePrealoder=function(data)
		{
			var i=0;
			var count=$this.backgroundImage.length;

			var pagePreloader=$('.page-preloader:first');
			var pagePreloaderThumbnailList=$(document.createElement('ul'));

			pagePreloaderThumbnailList.attr('class','no-list box-center');

			pagePreloader.prepend(pagePreloaderThumbnailList);

			$this.textBlink(pagePreloader.find('p'));

			$($this.backgroundImage).each(function(index) 
			{			
				var image=$(document.createElement('img'));	
				var element=$(document.createElement('li'));

				pagePreloaderThumbnailList.append(element);

				if($.browser.msie) 
					image.attr('src',$this.backgroundImage[index].image+'?i='+getRandom(1,10000));
				else image.attr('src',$this.backgroundImage[index].image);

				$(image).bind('load',function() 
				{
					element.animate({opacity:1},100,function() 
					{
						if((++i)==count) data.onComplete.apply();
					});
				});
			});
		};

		/**********************************************************************/

		this.textBlink=function(element)
		{
			$(element).animate({opacity:($(element).css('opacity')==1 ? 0.2 : 1)},500,function() { $this.textBlink($(this)); });
		};

		/**********************************************************************/

		this.isEnable=function()
		{
			if(!$this.enable)
			{
				if($this.previousHash!='')
					window.location.href=$this.previousHash;
				return(false);
			}  

			return(true);
		};

		/**********************************************************************/
	};

	/**************************************************************************/

	$.fn.monaco=function(options,page,backgroundImage)
	{
		/**********************************************************************/

		var monaco=new Monaco(options,page,backgroundImage);
		monaco.load();

		/**********************************************************************/
	};

	/**************************************************************************/

})(jQuery);