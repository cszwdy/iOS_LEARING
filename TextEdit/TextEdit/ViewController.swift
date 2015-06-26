//
//  ViewController.swift
//  TextEdit
//
//  Created by Emiaostein on 6/26/15.
//  Copyright © 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITextViewDelegate {

    @IBOutlet weak var textView: UITextView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        print(textView.font?.fontName)
        
        UIFont.familyNames()
        
        textView.font = UIFont(name: "DS-Digital", size: 30)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
//    func textViewDidChange(textView: UITextView) {
//        
//        let width = textView.bounds.width
//        let size = textView.sizeThatFits(CGSize(width: width, height: CGFloat.max))
//        textView.bounds.size = size
//    }

    @IBAction func ColorDidChanged(sender: UISegmentedControl) {
        
        if sender.selectedSegmentIndex == 0 {
            textView.textColor = UIColor.whiteColor()
        } else if sender.selectedSegmentIndex == 1 {
            textView.textColor = UIColor.redColor()
        } else if sender.selectedSegmentIndex == 2 {
            textView.textColor = UIColor.yellowColor()
        }
    }

    @IBAction func segementDidChanged(sender: UISegmentedControl) {
        
        if sender.selectedSegmentIndex == 0 {
            textView.textAlignment = .Left
        } else if sender.selectedSegmentIndex == 1 {
            textView.textAlignment = .Center
        } else if sender.selectedSegmentIndex == 2 {
            textView.textAlignment = .Right
        }
    }
    @IBAction func fontsizeDidChanged(sender: UIStepper) {
        
        textView.font = textView.font!.fontWithSize(CGFloat(sender.value))
    
    }
    var begainSize: CGFloat = 0
    @IBAction func pinchAction(sender: UIPinchGestureRecognizer) {
        
        switch sender.state {
        case .Began:
            begainSize = textView.font!.pointSize
        case .Changed:
            textView.font = textView.font!.fontWithSize(begainSize * sender.scale)
            
        default:
            return
        }
        
    }
    @IBAction func fontDidChanged(sender: UISegmentedControl) {
        
        guard let fontSize = textView.font?.pointSize else {
            return
        }
        if sender.selectedSegmentIndex == 0 {
            textView.font = UIFont(name: "DS-Digital", size: fontSize)
        } else if sender.selectedSegmentIndex == 1 {
            textView.font = UIFont.systemFontOfSize(fontSize)
        }
    }
    @IBOutlet weak var fontDidChanged: UISegmentedControl!
    @IBOutlet var pinchAction: UIPinchGestureRecognizer!
}

