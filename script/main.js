
$(document).ready(function() 
{
	var options=
	{
		googleMap			:
		{
			coordinates		:	[37.816,-122.5717]
		}
	};
	
	var backgroundImage=
	[
		{image:'image/background/01.jpg'},	
		{image:'image/background/02.jpg'},
		{image:'image/background/03.jpg'},
		{image:'image/background/04.jpg'},
		{image:'image/background/05.jpg'},
		{image:'image/background/06.jpg'}		
	];
	
	var page=
	{
		'about':
			{menuIndex:0,imageIndex:1},
		// 'services':
		// 	{menuIndex:1,imageIndex:2},
		// 'testimonials':
		// 	{menuIndex:2,imageIndex:3},
		'resume': 
			{menuIndex:3,imageIndex:4},
		'portfolio-1': 
			{menuIndex:4,imageIndex:5},
		// 'portfolio-2': 
		// 	{menuIndex:4,imageIndex:5},
		'contact': 
			{menuIndex:5,imageIndex:6},
		'blog':
			{menuIndex:7,imageIndex:6}
	}; 
	
	$().monaco(options,page,backgroundImage);
	
	$('label.infield').inFieldLabels();
});