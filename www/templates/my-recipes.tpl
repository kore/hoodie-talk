{{#recipes}}
<li>
    {{title}}
    {{#$public}}
        <a class="unshare" href="" data-recipe="{{id}}">
            <span class="text-success glyphicon glyphicon-check"></span>
        </a>
    {{/$public}}
    {{^$public}}
        <a class="share" href="" data-recipe="{{id}}">
            <span class="text-danger glyphicon glyphicon-share"></span>
        </a>
    {{/$public}}
</li>
{{/recipes}}
