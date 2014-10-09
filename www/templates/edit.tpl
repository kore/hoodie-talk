<h2>Edit {{title}}</h2>

<form role="form">
  <input type="hidden" name="id" value="{{id}}" />
  <input type="hidden" name="_rev" value="{{_rev}}" />
  <div class="form-group">
    <label for="title">Title</label>
    <input type="text" class="form-control" name="title" value="{{title}}" />
  </div>
  <div class="form-group">
    <label>Ingredients</label>
  {{#ingredients}}
    <div class="row ingredients">
      <div class="col-md-2">
        <input type="text" class="form-control" name="amount" value="{{amount}}" />
      </div>
      <div class="col-md-2">
        <select type="select" size="1" class="form-control" name="unit">
          <option value="g">Gram</option>
          <option value="ml">Milliliter</option>
          <option value="pcs">Pieces</option>
          <option value="tsp">Tee spoons</option>
          <option value="tbsp">Table spoons</option>
        </select>
      </div>
      <div class="col-md-8">
        <input type="text" class="form-control" name="name" value="{{name}}" />
      </div>
    </div>
  {{/ingredients}}
    <button type="button" class="btn btn-default ingredient"><span class="glyphicon glyphicon-plus"></span> Add ingredient</button>
  </div>
  <div class="form-group">
    <label for="instructions">Instructions</label>
    <textarea name="instructions" class="form-control" rows="10">{{instructions}}</textarea>
  </div>
  <button type="submit" class="btn btn-default">Update</button>
</form>
