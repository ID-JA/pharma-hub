namespace PharmaHub.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]

public class SuppliersController(ISupplierService supplierService) : ControllerBase
{
    [HttpPost]
    [MustHavePermission(AppAction.Create, AppResource.Suppliers)]
    public async Task<ActionResult> CreateSupplier([FromBody] SupplierDto request, CancellationToken cancellationToken)
    {
        await supplierService.CreateAsync(request, cancellationToken);
        return NoContent();
    }

    [HttpGet]
    [MustHavePermission(AppAction.View, AppResource.Suppliers)]
    public async Task<ActionResult> GetSuppliers(CancellationToken cancellationToken)
    {
        return Ok(await supplierService.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id:int}")]
    [MustHavePermission(AppAction.View, AppResource.Suppliers)]
    public async Task<ActionResult> GetOrders([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await supplierService.GetByIdAsync(id, cancellationToken);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPut("{id:int}")]
    [MustHavePermission(AppAction.Update, AppResource.Suppliers)]
    public async Task<ActionResult> UpdateSupplier([FromRoute] int id, [FromBody] SupplierDto request, CancellationToken cancellationToken)
    {
        var result = await supplierService.UpdateAsync(id, request, cancellationToken);
        return result ? Ok(result) : NotFound();
    }

    [HttpDelete("{id:int}")]
    [MustHavePermission(AppAction.Delete, AppResource.Suppliers)]
    public async Task<ActionResult> DeleteSupplier([FromRoute] int id, CancellationToken cancellationToken)
    {
        var result = await supplierService.DeleteAsync(id, cancellationToken);
        return result ? Ok(result) : NotFound();
    }
}
