namespace PharmaHub.API;

[Route("api/[Controller]")]
[ApiController]
[Authorize]
public class SettingsController(IAppSettingService settingService) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppSetting>>> GetSettings()
    {
        var settings = await settingService.GetAllSettings();
        return Ok(settings);
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<string>> GetSetting(string key)
    {
        var settingValue = await settingService.GetSettingValue(key);

        if (settingValue == null)
        {
            return NotFound();
        }

        return Ok(settingValue);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSetting(AppSetting setting)
    {
        await settingService.CreateSetting(setting);
        return CreatedAtAction(nameof(GetSetting), new { key = setting.SettingKey }, setting);
    }

    [HttpPut("{key}")]
    public async Task<IActionResult> UpdateSetting(string key, AppSetting setting)
    {
        try
        {
            await settingService.UpdateSetting(key, setting);
        }
        catch (ArgumentException)
        {
            return BadRequest("Key mismatch");
        }

        return NoContent();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] List<SettingUpdateDto> settings)
    {
        if (settings == null || settings.Count == 0)
        {
            return BadRequest("Settings data is invalid.");
        }

        await settingService.UpdateSettingsAsync(settings);

        return NoContent();
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> DeleteSetting(string key)
    {
        await settingService.DeleteSetting(key);
        return NoContent();
    }
}
