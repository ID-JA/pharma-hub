using Microsoft.EntityFrameworkCore;

public class SettingUpdateDto
{
    public string SettingKey { get; set; }
    public string SettingValue { get; set; }
}

public interface IAppSettingService
{
    Task<IEnumerable<AppSetting>> GetAllSettings();
    Task<string> GetSettingValue(string key);
    Task CreateSetting(AppSetting setting);
    Task UpdateSetting(string key, AppSetting setting);
    Task DeleteSetting(string key);
    Task UpdateSettingsAsync(List<SettingUpdateDto> settings);

}

public class AppSettingService(ApplicationDbContext dbContext) : IAppSettingService
{
    public async Task<IEnumerable<AppSetting>> GetAllSettings()
    {
        return await dbContext.AppSettings.ToListAsync();
    }

    public async Task<string> GetSettingValue(string key)
    {
        var setting = await dbContext.AppSettings
            .Where(s => s.SettingKey == key)
            .Select(s => s.SettingValue)
            .FirstOrDefaultAsync();

        return setting;
    }

    public async Task CreateSetting(AppSetting setting)
    {
        dbContext.AppSettings.Add(setting);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateSettingsAsync(List<SettingUpdateDto> settings)
    {
        foreach (var settingDto in settings)
        {
            var setting = await dbContext.AppSettings
                .FirstOrDefaultAsync(s => s.SettingKey == settingDto.SettingKey);

            if (setting != null)
            {
                setting.SettingValue = settingDto.SettingValue;
                dbContext.AppSettings.Update(setting);
            }
        }

        await dbContext.SaveChangesAsync();
    }
    public async Task UpdateSetting(string key, AppSetting setting)
    {
        if (key != setting.SettingKey)
        {
            throw new ArgumentException("Key mismatch");
        }

        dbContext.Entry(setting).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteSetting(string key)
    {
        var setting = await dbContext.AppSettings.FirstOrDefaultAsync(s => s.SettingKey == key);
        if (setting != null)
        {
            dbContext.AppSettings.Remove(setting);
            await dbContext.SaveChangesAsync();
        }
    }
}
