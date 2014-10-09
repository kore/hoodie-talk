{{#recipes}}
<li>
    <strong>{{title}}</strong>
    {{#$public}}
        <a class="unshare" href="" data-recipe="{{id}}" title="Unpublish recipe {{title}}">
            <span class="text-success glyphicon glyphicon-check"></span>
        </a>
    {{/$public}}
    {{^$public}}
        <a class="share" href="" data-recipe="{{id}}" title="Share recipe {{title}}">
            <span class="text-danger glyphicon glyphicon-share"></span>
        </a>
    {{/$public}}
        <a class="edit" href="" data-recipe="{{id}}" title="Edit recipe {{title}}">
            <span class="text-muted glyphicon glyphicon-pencil"></span>
        </a>
        <a class="delete" href="" data-recipe="{{id}}" title="Remove recipe {{title}}">
            <span class="text-muted glyphicon glyphicon-remove"></span>
        </a>
</li>
{{/recipes}}
