namespace ApiFutebol.Models;

public class ClubeEntity
{
    public int id { get; set; }
    public string nome { get; set; } = "";
    public string estado { get; set; } = "";
    public bool serieA { get; set; }
}